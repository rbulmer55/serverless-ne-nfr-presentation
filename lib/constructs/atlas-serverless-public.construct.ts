import { config, Environment } from '@infraConfig';
import { StackProps } from 'aws-cdk-lib';
import {
	AccessListDefinition,
	AtlasServerlessBasic,
	ScopeDefinitionType,
	ServerlessInstanceProviderSettingsProviderName,
} from 'awscdk-resources-mongodbatlas';
import { Construct } from 'constructs';

interface AtlasStackProps {
	readonly profile: string;
	readonly region: string;
	readonly instanceName: string;
	readonly projectName: string;
	readonly continuousBackupEnabled: boolean;
	readonly terminationProtectionEnabled: boolean;
	readonly username: string;
}

interface CustomPublicAtlasServerlessProps extends StackProps {
	atlas: {
		orgId: string;
		ipWhitelist: string[];
	};
}

export class PublicAtlasServerless extends Construct {
	constructor(
		scope: Construct,
		id: string,
		props: CustomPublicAtlasServerlessProps
	) {
		super(scope, id);

		if (!props.atlas.ipWhitelist) {
			throw new Error(
				'No ip addresses to whitelist, please provide at least one'
			);
		}

		const atlasProps = this.getContextProps();

		const atlas = new AtlasServerlessBasic(this, 'PublicAtlasSlsInstance', {
			serverlessProps: {
				name: atlasProps.instanceName,
				profile: atlasProps.profile,
				continuousBackupEnabled: atlasProps.continuousBackupEnabled,
				providerSettings: {
					providerName:
						ServerlessInstanceProviderSettingsProviderName.SERVERLESS,
					regionName: atlasProps.region,
				},
				terminationProtectionEnabled: atlasProps.terminationProtectionEnabled,
			},
			projectProps: {
				name: atlasProps.projectName,
				orgId: props.atlas.orgId,
			},
			dbUserProps: {
				username: atlasProps.username,
				scopes: [
					{ name: atlasProps.instanceName, type: ScopeDefinitionType.CLUSTER },
				],
			},
			ipAccessListProps: {
				accessList: [
					// map round our whitelist IP Props incase there are many
					...props.atlas.ipWhitelist.map((ip): AccessListDefinition => {
						return { ipAddress: ip };
					}),
				],
			},
			profile: atlasProps.profile,
		});
	}

	private getContextProps(): AtlasStackProps {
		const profile = config.environment;
		const region = config.region.toUpperCase().replace(/-/gi, '_');
		const instanceName = `${config.environment}-${config.domain}-${config.projectName}`;
		const projectName = `${config.environment}-${config.domain}-${config.projectName}`;
		const username = `${config.environment}-${config.domain}-${config.projectName}-user`;
		const terminationProtectionEnabled =
			config.environment === Environment.Prd ? true : false;
		const continuousBackupEnabled =
			config.environment === Environment.Prd ? true : false;

		return {
			terminationProtectionEnabled,
			continuousBackupEnabled,
			profile,
			region,
			instanceName,
			projectName,
			username,
		};
	}
}
