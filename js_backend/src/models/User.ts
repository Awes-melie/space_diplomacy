import { mongo } from '../database';
import { v4 } from 'uuid';
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { ErrorMessage } from '../middlewares';

export interface UserDB {
	email: string;
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

	/** creates a new user with password, returning that user */
	static async create(email: string, password: string) {
		const hashedPassword = await hashPassword(password);

		try {
			await User.collection.insertOne({
				email,
				created: new Date(),
				localCredentials: {
					verified: false,
					verificationCode: v4(),
					hashedPassword,
				},
			});
		} catch (err) {
			// user may already exist
		}

		const user = await User.collection.findOne({ email });

		if (!user) throw new ErrorMessage('Failed to create the user');
		if (user.localCredentials.verified)
			throw new ErrorMessage('User already exists', 400);
		if (user.localCredentials.verificationCode)
			throw new ErrorMessage('User already exists', 400);

		const { localCredentials, ...sanitisedUser } = user;
		return sanitisedUser;
	}

	/** Called to verify an account email - clears the verificationCode and sets
	 * it to verified returning the user document on success, or null on failure*/
	static async verify(email: string, verificationCode: string) {
		const user = await User.collection.findOneAndUpdate(
			{
				email,
				'localCredentials.verified': false,
				'localCredentials.verificationCode': verificationCode,
			},
			{
				$set: {
					'localCredentials.verified': new Date(),
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

		const { localCredentials, ...sanitisedUser } = user;
		return sanitisedUser;
	}

	static async authenticate(email: string, password: string) {
		const user = await User.collection.findOne({
			email,
			verified: { $ne: false },
		});
		const valid = await validatePassword(
			password,
			user?.localCredentials.hashedPassword ||
				'nonexistinguserhash.andsalt'
		);
		if (!valid) return null;
		if (!user) throw new ErrorMessage('Unable to verify the user', 404);

		const { localCredentials, ...sanitisedUser } = user;
		return sanitisedUser;
	}
}
