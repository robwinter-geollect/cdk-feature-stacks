import { Stage, StageProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ExampleAppStack } from '../../../example-app/example-app-stack';

type EnvironmentStageProps = StageProps & {
  environmentId: string;
};

export class ExampleDeploymentStage extends Stage {
  constructor(scope: Construct, id: string, props: EnvironmentStageProps) {
    super(scope, id, props);

    new ExampleAppStack(this, `ExampleAppStack`, {
      description: 'Example App Stack from the CDK template repository',
      environmentId: props.environmentId,
      tags: {
        Service: 'example-app',
      },
    });
  }
}
