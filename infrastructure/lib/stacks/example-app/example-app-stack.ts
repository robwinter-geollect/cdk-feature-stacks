import path from 'path';
import { aws_ec2, aws_ecs } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { GeollectStack, GeollectStackProps } from '../geollect-stack';


const rootPath = path.posix.join(__dirname, '..', '..', '..', '..');
const file = path.posix.join('projects', 'hello_world');
const directory = path.posix.join(rootPath, file);

type Props = GeollectStackProps

export class HelloWorldStack extends GeollectStack {
  constructor(scope: Construct, id: string, { environmentId, ...props }: Props) {
    super(scope, id, { environmentId, ...props });
    const vpc = new aws_ec2.Vpc(this, 'HelloWorldVpc', {
    });

    const cluster = new aws_ecs.Cluster(this, 'HelloWorldCluster', {
      vpc,
    });

    const imageAsset = new DockerImageAsset(this, 'HelloWorldImage', {
      directory,
    });

    const taskDefinition = new aws_ecs.FargateTaskDefinition(this, 'HelloWorldTaskDefintion');
    taskDefinition.addContainer('HelloWorldContainer', {
      image: aws_ecs.ContainerImage.fromDockerImageAsset(imageAsset),
      memoryLimitMiB: 512,
      cpu: 256,
    });

    new aws_ecs.FargateService(this, 'HelloWorldService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
    }
    )
  }
}
