import { mongo } from '../database';
import { v4 } from 'uuid';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { ErrorMessage } from '../middlewares';

export interface UserDB {
	email: string;
	displayName: string;
	created: Date;
	localCredentials: {
		verified: false | Date;
		verificationCode?: string;
		hashedPassword?: string;
	};
}

const hashPassword = (password: string) =>
	new Promise<string>((resolve, reject) => {
		const salt = randomBytes(16).toString('hex');
		scrypt(password, salt, 64, (err, result) => {
			if (err) return reject(err);
			resolve(`${result.toString('hex')}.${salt}`);
		});
	});

const validatePassword = (
	suppliedPassword: string,
	storedHashedPassword: string
) =>
	new Promise<boolean>((resolve, reject) => {
		const [hashedPassword, salt] = storedHashedPassword.split('.');
		const hashedPasswordBuf = Buffer.from(hashedPassword, 'hex');
		scrypt(suppliedPassword, salt, 64, (err, result) => {
			if (err) return reject(err);
			resolve(timingSafeEqual(hashedPasswordBuf, result));
		});
	});

export class User {
	static get collection() {
		return mongo.db.collection<UserDB>('users');
	}

	/** removes secret server-side data  */
	static sanitize(user: UserDB): Omit<UserDB, 'localCredentials'> {
		const { localCredentials, ...sanitisedUser } = user;
		return sanitisedUser;
	}

	static async createIndexes() {
		if (!(await User.collection.indexExists('email_1'))) {
			console.log('Creating index on User:email');
			await User.collection.createIndex(
				{
					email: 1,
				},
				{ unique: true, name: 'email_1' }
			);
		}
	}

	/** creates a new unverified user */
	static async create(email: string, displayName: string) {
		const canonicalisedEmail = email.trim().toLocaleLowerCase();
		if (!email || email.length < 3 || email.length > 320)
			throw new ErrorMessage('Invalid email address', 400);
		if (displayName.length < 3 || displayName.length > 32)
			throw new ErrorMessage('Invalid displayName', 400);

		let newlyInserted = false;

		try {
			const res = await User.collection.insertOne({
				email: canonicalisedEmail,
				displayName,
				created: new Date(),
				localCredentials: {
					verified: false,
					verificationCode: v4(),
					hashedPassword: 'unverified:account',
				},
			});
			if (res.insertedId) {
				newlyInserted = true;
			}
		} catch (err) {
			if (!`${err}`.includes('E11000')) {
				// E11000 this is the error code for duplicate key
				// so this is another error - rethrow
				throw err;
			}
			// user already exists.. this is a no-op
		}

		const user = await User.collection.findOne({ email });

		if (!user) throw new ErrorMessage('Failed to create the user');

		return { newlyInserted, user: User.sanitize(user) };
	}

	/** Called to verify an account email - clears the verificationCode and sets
	 * it to verified returning the user document on success, or null on failure*/
	static async verify(
		email: string,
		verificationCode: string,
		password1: string,
		password2: string
	) {
		if (password1 !== password2)
			throw new ErrorMessage('Passwords do not match');
		const hashedPassword = await hashPassword(password1);

		const user = await User.collection.findOneAndUpdate(
			{
				email,
				'localCredentials.verified': false,
				'localCredentials.verificationCode': verificationCode,
			},
			{
				$set: {
					'localCredentials.verified': new Date(),
					'localCredentials.hashedPassword': hashedPassword,
				},
				$unset: {
					'localCredentials.verificationCode': 1,
				},
			},
			{
				returnDocument: 'after',
			}
		);
		if (!user) throw new ErrorMessage('Unable to verify the user', 404);

		return User.sanitize(user);
	}

	static async authenticate(email: string, password: string) {
		const user = await User.collection.findOne({
			email,
			verified: { $ne: false },
		});
		const valid = await validatePassword(
			password,
			user?.localCredentials.hashedPassword || 'unverified:account'
		);
		if (!valid) return null;
		if (!user) throw new ErrorMessage('Unable to verify the user', 404);

		return User.sanitize(user);
	}
}
