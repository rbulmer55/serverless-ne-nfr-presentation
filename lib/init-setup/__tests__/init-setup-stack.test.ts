import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { InitSetupStack } from '../init-setup-stack';

const env = {
	domain: 'mydomain',
	environment: 'fdv',
	mongoAtlasOrgId: 'org-abc123',
	projectName: 'atlas-example',
	region: 'eu-west-1',
};

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
describe('All atlas-example stacks created and has correct properties', () => {
	test('Setup Stack', () => {
		const app = new App();
		const stack = new InitSetupStack(app, 'InitalSetupStack');

		expect(Template.fromStack(stack)).toMatchSnapshot();
	});
});
