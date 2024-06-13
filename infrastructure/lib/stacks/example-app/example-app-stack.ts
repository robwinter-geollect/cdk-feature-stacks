// import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
// import { Construct } from 'constructs';
// import { GeollectStack, GeollectStackProps } from '../geollect-stack';

// type Props = GeollectStackProps;

// export class HelloWorldStack extends GeollectStack {
//   constructor(scope: Construct, id: string, { environmentId, ...props }: Props) {
//     super(scope, id, { environmentId, ...props });

//     new LambdaFunction(this, 'ExampleFunction', {
//       code: Code.fromInline('exports.handler = async function(event, context) { return "hello world"; }'),
//       handler: 'index.handler',
//       runtime: Runtime.NODEJS_18_X,
//     });
//   }
// }
import path from 'path';
import { aws_ec2, aws_ecs } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { GeollectStack, GeollectStackProps } from '../geollect-stack';


const rootPath = path.posix.join(__dirname, '..', '..', '..', '..');
console.log('rootPath: ', rootPath);
const file = path.posix.join('projects', 'hello_world');
console.log('file: ', file);
type Props = GeollectStackProps

const directory = path.posix.join(rootPath, file);

export class HelloWorldStack extends GeollectStack {
  constructor(scope: Construct, id: string, { environmentId, ...props }: Props) {
    super(scope, id, { environmentId, ...props });
    console.log('vpc');
    const vpc = new aws_ec2.Vpc(this, 'HelloWorldVpc', {
    });
    console.log('cluster');

    const cluster = new aws_ecs.Cluster(this, 'HelloWorldCluster', {
      vpc,
    });

    console.log('imageAsset');
    const imageAsset = new DockerImageAsset(this, 'HelloWorldImage', {
      directory,
    });

    console.log('taskDefinition');
    const taskDefinition = new aws_ecs.FargateTaskDefinition(this, 'HelloWorldTaskDefintion');
    taskDefinition.addContainer('HelloWorldContainer', {
      image: aws_ecs.ContainerImage.fromDockerImageAsset(imageAsset),
      memoryLimitMiB: 512,
      cpu: 256,
    });

    console.log('service');
    new aws_ecs.FargateService(this, 'HelloWorldService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
    }
    )
  }
}
