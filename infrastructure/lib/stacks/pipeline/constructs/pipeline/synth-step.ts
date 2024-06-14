import { Arn, Stack } from 'aws-cdk-lib';
import { CodeBuildStep, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import path from 'path';
import { CTX_BRANCH, CTX_ENV_ID, CTX_REPOSITORY } from '../../../../context';
import { FEATURE_ENV_CONFIG_ENV_VAR_NAME, getEnvConfig, isFeatureEnvId } from '../../../../environment';

// This path needs to be relative from the root of the source code repository
const projectDir = path.join('infrastructure');


const createSourceConnection = (scope: Construct) =>
  CodePipelineSource.connection(scope.node.getContext(CTX_REPOSITORY), scope.node.getContext(CTX_BRANCH), {
    // Created using the AWS console  
    connectionArn: Arn.format(
      {
        service: 'codestar-connections',
        region: 'us-east-1',
        resource: 'connection',
        resourceName: getEnvConfig(scope).pipelines.codestarConnectionId,
      },
      Stack.of(scope)
    ),
  });

export class SynthStep extends CodeBuildStep {
  constructor(scope: Construct) {
    super('Synth', {
      input: createSourceConnection(scope),
      env: {
        BRANCH: scope.node.getContext(CTX_BRANCH),
        ENV_ID: scope.node.getContext(CTX_ENV_ID),
        PROJECT_DIR: projectDir,
        AWS_ACCOUNT_ID: Stack.of(scope).account,
        ...(isFeatureEnvId(scope.node.getContext(CTX_ENV_ID)) && {
          [FEATURE_ENV_CONFIG_ENV_VAR_NAME]: JSON.stringify(getEnvConfig(scope)),
        }),
      },
      commands: [`bash ${path.join(projectDir, 'build.sh')}`],
      primaryOutputDirectory: path.join(projectDir, 'cdk.out'),
    });
  }
}
