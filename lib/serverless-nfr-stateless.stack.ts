import * as cdk from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import {
	IVpc,
	Peer,
	Port,
	SecurityGroup,
	SubnetType,
} from 'aws-cdk-lib/aws-ec2';
import { Architecture, HttpMethod, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, SourceMapMode } from 'aws-cdk-lib/aws-lambda-nodejs';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { join } from 'path';
import { config } from '@infraConfig';

interface CustomStackProps extends cdk.StackProps {
	atlasVpc: IVpc;
}

export class ServerlessNfrStatelessStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: CustomStackProps) {
		super(scope, id, props);
		if (!props?.atlasVpc) {
			throw new Error('Application VPC not provided');
		}

		const AppSecurityGroup = new SecurityGroup(this, 'AppSecurityGroup', {
			vpc: props.atlasVpc,
			allowAllOutbound: true,
		});
		AppSecurityGroup.addIngressRule(
			Peer.ipv4(props.atlasVpc.vpcCidrBlock),
			Port.allTraffic()
		);

		const nfrAPI = new RestApi(this, 'myApi', {});
		const customerResourceApi = nfrAPI.root.addResource('customer');
		const customerResourceApiById = customerResourceApi.addResource('{id}');

		const getCustomerLambda = new NodejsFunction(this, 'getCustomerLambda', {
			entry: join('./src/adapters/primary/customer/get-customer.adapter.ts'),
			handler: 'getCustomer',
			runtime: Runtime.NODEJS_18_X,
			architecture: Architecture.ARM_64,
			timeout: cdk.Duration.seconds(10),
			vpc: props.atlasVpc,
			vpcSubnets: props.atlasVpc.selectSubnets({
				subnetType: SubnetType.PRIVATE_WITH_EGRESS,
			}),
			securityGroups: [AppSecurityGroup],
			bundling: {
				minify: true,
				sourceMap: true,
				sourceMapMode: SourceMapMode.INLINE,
			},
			environment: {
				COUNTER_DB_CONNECTION_SECRET: `db/atlas/${config.environment}/${config.projectName}`,
			},
			logRetention: RetentionDays.THREE_MONTHS,
		});

		customerResourceApiById.addMethod(
			HttpMethod.GET,
			new LambdaIntegration(getCustomerLambda)
		);

		const dbSecret = new Secret(this, 'db-connection-secret', {
			secretName: `db/atlas/${config.environment}/${config.projectName}`,
			secretObjectValue: {
				dbConnectionString: cdk.SecretValue.unsafePlainText('REPLACE_ME'),
			},
		});
		dbSecret.grantRead(getCustomerLambda);
	}
}
