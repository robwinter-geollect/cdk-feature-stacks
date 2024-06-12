import path from 'path';
import { aws_ec2, aws_ecs } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { GeollectStack, GeollectStackProps } from '../geollect-stack';


const rootPath = path.posix.join(__dirname, '..', '..', '..', '..', '..', '..', '..');

type Props = GeollectStackProps

export class HelloWorldStack extends GeollectStack {
  constructor(scope: Construct, id: string, { environmentId, ...props }: Props) {
    super(scope, id, { environmentId, ...props });

    const vpc = aws_ec2.Vpc.fromLookup(this, 'Vpc', {
      isDefault: true,
    });
    const cluster = new aws_ecs.Cluster(this, 'HelloWorldCluster', {
      vpc,
    });
    const taskDefinition = new aws_ecs.FargateTaskDefinition(this, 'HelloWorldTaskDefintion');

    taskDefinition.addContainer('HelloWorldContainer', {
      image: aws_ecs.ContainerImage.fromDockerImageAsset(new DockerImageAsset(this, 'HelloWorldImage', {
        directory: rootPath,
        file: path.posix.join('projects', 'hello_world', 'Dockerfile')
      })),
      memoryLimitMiB: 512,
      cpu: 256,
    });

    new aws_ecs.FargateService(this, 'HelloWorldService', {
      cluster,
      taskDefinition,
      // desiredCount: 1,
      // assignPublicIp: true,
    });
  }
}
