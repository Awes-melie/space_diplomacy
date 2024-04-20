import { mongo } from './database';
import { User } from './models/User';

const collections = ['users'];
export const databaseMaintenance = async () => {
	const collectionNames = (await mongo.db.listCollections().toArray()).map(
		(info) => info.name
	);
	console.log(`Performing database maintenance`);

	for (let index = 0; index < collections.length; index++) {
		const collection = collections[index];
		if (!collectionNames.includes(collection)) {
			console.log(`Creating databse collection '${collection}'`);
			await mongo.db.createCollection(collection);
		}
	}

	await User.createIndexes();
};
