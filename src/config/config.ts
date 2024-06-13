import convict from 'convict';

export const config = convict({
	counterDbConnectionSecret: {
		doc: 'The secret name for the counter database',
		format: String,
		default: 'counterSecret',
		env: 'COUNTER_DB_CONNECTION_SECRET',
	},
}).validate({ allowed: 'strict' });
