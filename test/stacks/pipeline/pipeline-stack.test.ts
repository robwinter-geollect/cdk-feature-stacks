import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { CTX_APP_NAME, CTX_BRANCH, CTX_ENV_ID, CTX_PRODUCT, CTX_REPOSITORY } from '../../../lib/context';
import { PipelineStack } from '../../../lib/stacks/pipeline/pipeline-stack';
import { testEnvConfig } from '../../test-env-config';

const context = {
  [CTX_PRODUCT]: 'testProduct',
  [CTX_ENV_ID]: 'testEnv',
  [CTX_REPOSITORY]: 'Geollect/test-repo',
  'aws:cdk:bundling-stacks': [],
  [CTX_BRANCH]: 'test-branch',
  [CTX_APP_NAME]: 'testApp',
};

describe('Pipeline Stack', () => {
  let testPipelineStack: PipelineStack;
  let template: Template;

  beforeEach(() => {
    const app = new App({ context });

    testPipelineStack = new PipelineStack(app, 'TestPipelineStack', {
      environmentId: 'testEnv',
      env: {
        account: '123456789012',
        region: 'eu-west-1',
      },
      tags: {
        Service: 'testService',
      },
    });

    template = Template.fromStack(testPipelineStack);
  });

  describe('Pipeline', () => {
    it('should create a pipeline with the correct name', () => {
      template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Name: 'testEnv-testProduct-testApp-pipeline',
      });
    });

    it('should use the codestar connection from the environment config', () => {
      template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
        Name: 'testEnv-testProduct-testApp-pipeline',
        Stages: Match.arrayWith([
          {
            Name: 'Source',
            Actions: Match.arrayWith([
              Match.objectLike({
                ActionTypeId: Match.objectLike({
                  Category: 'Source',
                  Provider: 'CodeStarSourceConnection',
                }),
                Configuration: Match.objectLike({
                  ConnectionArn: {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        `:codestar-connections:us-east-1:123456789012:connection/${testEnvConfig.pipelines.codestarConnectionId}`,
                      ],
                    ],
                  },
                }),
              }),
            ]),
          },
        ]),
      });
    });
  });
});
