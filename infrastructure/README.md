# Welcome to your CDK TypeScript project

This is a CDK app that deploys a CodePipeline that builds and deploys the application.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run lint` run linting against the project
- `npx cdk deploy` deploy this stack to your default AWS account/region. See [Deployment](#deployment) for more information.
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Bootstrapping

Prior to deploying CDK stacks to a region for the first time, the region must first be bootstrapped.
This can simply be done by running the following:

`npx cdk bootstrap aws://ACCOUNT-NUMBER/REGION`

Replacing 'ACCOUNT-NUMBER' and 'REGION' with the appropriate values.

See [The CDK docs on bootstrapping](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html) for more information.

## Deployment

To deploy the pipeline stack, run

`npx cdk deploy --context branch=<branch name> --context environmentId=<environment Id>`

Replacing:

- 'branch name' with the name of the branch you are deploying from
- 'environment Id' with the Id of the environment you are deploying to (see [the configuration README](./config/README.md) for information on configuring environments)
- - Alternatively, see [Feature Environments](#feature-environments) for more information on deploying feature environments

e.g. `npx cdk deploy --context branch=dev --context environmentId=dev`

### Feature Environments

It is possible to deploy 'feature' instances of this infrastructure which is useful for testing changes before merging them into the development branch.
To achieve this, provide an `environmentId` value _other than_ one of the permanently configured envionments in the [configuration files](./config/).
See [the configuration README](./config/README.md) for information on configuring environments.

- i.e. not 'dev', 'stage' or 'prod'. This value could instead be your name or a ticket ID.
- e.g. `npx cdk deploy --context branch=dev --context environmentId=dfreeman`

If an environment ID is given for configuration that cannot be found, an error will be raised.
