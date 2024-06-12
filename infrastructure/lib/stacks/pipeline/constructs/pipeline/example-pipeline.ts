import { CodePipeline } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { CTX_APP_NAME, CTX_ENV_ID, CTX_PRODUCT } from '../../../../context';
import { ExampleDeploymentStage } from '../deployment-stages/example-deployment';
import { SynthStep } from './synth-step';

export class ExamplePipeline extends CodePipeline {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      pipelineName: `${scope.node.getContext(CTX_ENV_ID)}-${scope.node.getContext(CTX_PRODUCT)}-${scope.node.getContext(
        CTX_APP_NAME
      )}-pipeline`,
      synth: new SynthStep(scope),
      dockerEnabledForSynth: true,
    });

    const environmentId = scope.node.getContext(CTX_ENV_ID);
    const product = scope.node.getContext(CTX_PRODUCT);
    const appName = scope.node.getContext(CTX_APP_NAME);

    this.addStage(
      new ExampleDeploymentStage(this, `${environmentId}-${product}-${appName}-Deployment`, {
        environmentId,
      })
    );
  }
}
