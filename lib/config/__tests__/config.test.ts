let config: any;

const env = {
	domain: 'mydomain',
	environment: 'fdv',
	mongoAtlasOrgId: 'org-abc123',
	projectName: 'atlas-example',
	region: 'eu-west-1',
};

describe('config', () => {
	beforeEach(() => {
		jest.resetModules();
		process.env = {
			REGION: env.region,
			ENVIRONMENT: env.environment,
			DOMAIN_NAME: env.domain,
			PROJECT_NAME: env.projectName,
			MONGO_ORG_ID: env.mongoAtlasOrgId,
		};
	});

	test('it should return the correct config when environment has been set', () => {
		config = require('@infra/config').config;

		expect(config).toEqual(env);
	});

	describe('it should throw error if environment variables have not been set', () => {
		test('region not set', () => {
			delete process.env.REGION;

			expect(() => {
				config = require('@infra/config').config;
			}).toThrow('Missing Region config');
		});

		test('environment not set', () => {
			delete process.env.ENVIRONMENT;

			expect(() => {
				config = require('@infra/config').config;
			}).toThrow('Missing Environment config');
		});

		test('domain not set', () => {
			delete process.env.DOMAIN_NAME;

			expect(() => {
				config = require('@infra/config').config;
			}).toThrow('Missing DomainName config');
		});

		test('project not set', () => {
			delete process.env.PROJECT_NAME;

			expect(() => {
				config = require('@infra/config').config;
			}).toThrow('Missing ProjectName config');
		});

		test('mongoAtlas Org not set', () => {
			delete process.env.MONGO_ORG_ID;

			expect(() => {
				config = require('@infra/config').config;
			}).toThrow('Missing MongoDB Atlas Organisation ID config');
		});
	});
});
