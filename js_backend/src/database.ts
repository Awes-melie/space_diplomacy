import { Db, MongoClient } from 'mongodb';

export enum Status {
	Disconnected = 'disconnected',
	Connected = 'connected',
}
class Mongo {
	private static _db: Db;
	private static status: Status = Status.Disconnected;
	get db() {
		return Mongo._db;
	}
	async connect() {
		const connectionString = process.env.DATABASE_CONNECTION_STRING;
		if (!connectionString) {
			console.error('No database connection string specified');
			return;
		}
		const client = new MongoClient(connectionString);
		Mongo._db = client.db();
		Mongo.status = Status.Connected;
		await this.db.collection('audit').insertOne({
			event: 'serverstart',
			date: new Date(),
		});
	}
	getStatus() {
		return Mongo.status;
	}
}

export const mongo = new Mongo();
