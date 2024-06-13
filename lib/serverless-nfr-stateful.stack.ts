import * as cdk from 'aws-cdk-lib';
import {
	CfnEIP,
	CfnNatGateway,
	CfnRoute,
	IVpc,
	SubnetType,
	Vpc,
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { config } from '@infraConfig';
import { PublicAtlasServerless } from '@constructs';

export class ServerlessNfrStatefulStack extends cdk.Stack {
	public readonly applicationVpc: IVpc;

	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const applicationVpc = new Vpc(this, 'AppVpc', {
			natGateways: 0,
			maxAzs: 1, // increase as necessary for HA
			cidr: '10.0.0.0/16',
			subnetConfiguration: [
				{
					cidrMask: 24,
					name: `${config.environment}-${config.domain}-${config.projectName}-pvt-app`,
					subnetType: SubnetType.PRIVATE_WITH_EGRESS,
				},
				{
					cidrMask: 24,
					name: `${config.environment}-${config.domain}-${config.projectName}-pub-app`,
					subnetType: SubnetType.PUBLIC,
				},
			],
		});
		this.applicationVpc = applicationVpc;

		const whitelistEips: string[] = [];
		/**
		 * Create an elastic IP and a nat gateway in each public subnet
		 * Add filtering if needed.
		 * Setting maxAZs to 1 above, so map is for more than 1 AZ.
		 *
		 */
		applicationVpc.publicSubnets.map((pubSubnet, index) => {
			const eip = new CfnEIP(this, `pubSubnetEIP-${index}`);
			const nat = new CfnNatGateway(this, `pubSubnetNAT-${index}`, {
				subnetId: pubSubnet.subnetId,
				allocationId: eip.attrAllocationId,
			});

			/**
			 * Attach the new nat gateway route to all private subnets
			 * Add filtering if needed.
			 * Setting maxAZs to 1 above, so map is for more than 1 AZ.
			 */
			applicationVpc.privateSubnets.map((prvSubnet, index2) => {
				new CfnRoute(this, `pubSubnet-${index}-prvSubnet-${index2}-route`, {
					natGatewayId: nat.attrNatGatewayId,
					destinationCidrBlock: '0.0.0.0/0',
					routeTableId: prvSubnet.routeTable.routeTableId,
				});
			});
			whitelistEips.push(eip.attrPublicIp);
		});

		new PublicAtlasServerless(this, 'atlasDatabase', {
			atlas: {
				orgId: config.mongoAtlasOrgId,
				ipWhitelist: whitelistEips,
			},
		});
	}
}
