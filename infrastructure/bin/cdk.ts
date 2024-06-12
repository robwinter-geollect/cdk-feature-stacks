#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'source-map-support/register';
import { CTX_APP_NAME, CTX_ENV_ID, CTX_PRODUCT } from '../lib/context';
import { PipelineStack } from '../lib/stacks/pipeline/pipeline-stack';

const app = new App();

const environmentId = app.node.getContext(CTX_ENV_ID);
const product = app.node.getContext(CTX_PRODUCT);
const appName = app.node.getContext(CTX_APP_NAME);

new PipelineStack(app, `${environmentId}${product}${appName}PipelineCDKStack`, {
  stackName: `${environmentId}-${product}-${appName}-cicd`,
  description: `Contains resources for build and deployment of ${product} ${appName}`,
  environmentId,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  tags: {
    Service: 'CI/CD',
  },
});
