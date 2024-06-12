import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { GeollectStack, GeollectStackProps } from '../geollect-stack';

type Props = GeollectStackProps;

export class ExampleAppStack extends GeollectStack {
  constructor(scope: Construct, id: string, { environmentId, ...props }: Props) {
    super(scope, id, { environmentId, ...props });

    new LambdaFunction(this, 'ExampleFunction', {
      code: Code.fromInline('exports.handler = async function(event, context) { return "hello world"; }'),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_18_X,
    });
  }
}
