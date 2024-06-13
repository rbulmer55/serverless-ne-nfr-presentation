import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {
	MongoAtlasBootstrap,
	MongoAtlasBootstrapProps,
	AtlasBasicResources,
} from 'awscdk-resources-mongodbatlas';
import { config } from '@infraConfig';

export class InitSetupStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const roleName = `MongoDB-Atlas-CDK-CFN-EXT-${config.domain}-${config.region}`;
		const mongoDBProfile = config.environment;

		// extend basic resources serverless and private routes
		const bootstrapProperties: MongoAtlasBootstrapProps = {
			roleName,
			secretProfile: mongoDBProfile,
			typesToActivate: [
				'ServerlessInstance',
				'ServerlessPrivateEndpoint',
				'PrivateEndpointService',
				'PrivateEndpointAWS',
				...AtlasBasicResources,
			],
		};

		new MongoAtlasBootstrap(
			this,
			'mongodb-atlas-bootstrap',
			bootstrapProperties
		);
	}
}
