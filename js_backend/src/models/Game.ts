import { mongo } from '../database';
import { ErrorMessage } from '../middlewares';
import { User } from './User';

export enum GameStatus {
	FORMING,
	RUNNING,
	PAUSED,
	ENDED,
}

export interface GameDB {
	displayName: string;
	created: Date;
	status: GameStatus;
	privateSession: Boolean;
}

export class Game {
	static get collection() {
		return mongo.db.collection<GameDB>('games');
	}

	/** creates a new game */
	static async create(
		displayName: string,
		privateSession: Boolean,
		email: string
	) {
		const host = await User.collection.findOne({ email });
		if (!host)
			throw new ErrorMessage(
				'You must log in or make an account to play'
			);

		if (displayName.length < 3 || displayName.length > 32)
			throw new ErrorMessage('Invalid displayName', 400);

		let newlyInserted = false;
		let _id;

		try {
			const res = await Game.collection.insertOne({
				displayName,
				created: new Date(),
				status: GameStatus.FORMING,
				privateSession,
			});
			if (res.insertedId) {
				newlyInserted = true;
				_id = res.insertedId;
			}
		} catch (err) {
			if (!`${err}`.includes('E11000')) {
				// E11000 this is the error code for duplicate key
				// so this is another error - rethrow
				throw err;
			}
			// game already exists.. this is a no-op
		}

		const game = await Game.collection.findOne({ _id });

		if (!game) throw new ErrorMessage('Failed to create the game');

		return { newlyInserted, game: game };
	}
}
