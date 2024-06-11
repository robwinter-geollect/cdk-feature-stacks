import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CTX_PRODUCT, CTX_REPOSITORY } from '../context';
import { GeollectTags } from './geollect-tags';

export type GeollectStackProps = StackProps & {
  environmentId: string;
  tags: {
    [GeollectTags.SERVICE]: string;
    [GeollectTags.CUSTOMER]?: string;
    [GeollectTags.PROJECT]?: string;
    [GeollectTags.DATA_PROVIDER]?: string;
    [key: string]: string | undefined;
  };
};

export class GeollectStack extends Stack {
  constructor(scope: Construct, id: string, props: GeollectStackProps) {
    super(scope, id, {
      ...props,
      tags: {
        [GeollectTags.PRODUCT]: scope.node.getContext(CTX_PRODUCT),
        [GeollectTags.ENVIRONMENT]: props.environmentId,
        [GeollectTags.VCS]: scope.node.getContext(CTX_REPOSITORY),
        ...props.tags,
      },
    });
  }
}
