import { Construct } from 'constructs';
import { GeollectStack, GeollectStackProps } from '../geollect-stack';
import { ExamplePipeline } from './constructs/pipeline/example-pipeline';

export type Props = GeollectStackProps;

export class PipelineStack extends GeollectStack {
  constructor(scope: Construct, id: string, { environmentId, ...props }: Props) {
    super(scope, id, { environmentId, ...props });

    new ExamplePipeline(this, 'Pipeline');
  }
}
