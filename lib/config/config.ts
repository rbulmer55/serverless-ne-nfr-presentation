export enum Environment {
	/**
	 * Sandbox environments, to be used for spikes and discoveries
	 */
	Sbx = 'sbx',
	/**
	 * Feature Development Environments, to be used for developing individual features.
	 */
	Fdv = 'fdv',
	/**
	 * Development Environment, the first "static" environment where integration begins.
	 */
	Dev = 'dev',
	/**
	 * Systems Integration Testing Environment, used for testing the integration of different systems.
	 */
	Sit = 'sit',
	/**
	 * Pre-Production Environment, a mirror of the production environment used for final testing.
	 */
	Pre = 'pre',
	/**
	 * Production Environment, where the software is finally deployed for end users.
	 */
	Prd = 'prd',
}

interface Config {
	environment: Environment;
	projectName: string;
	domain: string;
	region: string;
	mongoAtlasOrgId: string;
}

if (!process.env.ENVIRONMENT) {
	throw Error('Missing Environment config');
}

if (!process.env.REGION) {
	throw Error('Missing Region config');
}

if (!process.env.PROJECT_NAME) {
	throw Error('Missing ProjectName config');
}

if (!process.env.DOMAIN_NAME) {
	throw Error('Missing DomainName config');
}

/**
 * Fetched from the MongoDB Atlas account portal
 */
if (!process.env.MONGO_ORG_ID) {
	throw Error('Missing MongoDB Atlas Organisation ID config');
}

export const config: Config = {
	environment: process.env.ENVIRONMENT as Environment,
	projectName: process.env.PROJECT_NAME,
	domain: process.env.DOMAIN_NAME,
	region: process.env.REGION,
	mongoAtlasOrgId: process.env.MONGO_ORG_ID,
};
