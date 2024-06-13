#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ServerlessNfrStatelessStack } from '../lib/serverless-nfr-stateless.stack';
import { ServerlessNfrStatefulStack } from 'lib/serverless-nfr-stateful.stack';
import { InitSetupStack } from 'lib/init-setup/init-setup-stack';

const app = new cdk.App();

new InitSetupStack(app, `AtlasSetupStack`, {});

const statefulStack = new ServerlessNfrStatefulStack(
	app,
	'ServerlessNfrStatefulStack',
	{}
);
new ServerlessNfrStatelessStack(app, 'ServerlessNfrStatelessStack', {
	atlasVpc: statefulStack.applicationVpc,
});
