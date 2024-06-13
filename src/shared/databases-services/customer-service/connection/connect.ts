import { connect as mongooseConnect, ConnectOptions, Mongoose } from 'mongoose';
import { fetchConnectionSecret } from './fetch-connection-secret';
import { config } from '@config/config';

let connection: Mongoose;

const secretName = config.get('counterDbConnectionSecret');

const defaultConnOptions: ConnectOptions = {
	// Options such as pool size, ssl etc
};

export async function connect(options: ConnectOptions = {}) {
	if (connection) {
		return connection;
	}

	console.log('DB Service: Fetching Connection String');
	console.log(`DB Service: **** ${secretName}`);
	const dbConnectionString = await fetchConnectionSecret(secretName);

	console.log('DB Service: Connecting to database');
	connection = await mongooseConnect(dbConnectionString, {
		...defaultConnOptions,
		...options,
	});
	console.log('DB Service: Connected');

	return connection;
}
