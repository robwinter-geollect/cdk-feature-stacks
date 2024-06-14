#!/bin/env bash
set -x

cd ${PROJECT_DIR}
npm ci
npm run test
npm run lint
set -e
# Build docker images and push to ECR and then retrieve the image URI and pass to the context of the synth step
aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
echo Build started on `date`

docker-compose -f ../docker-compose.yaml build
docker-compose -f ../docker-compose.yaml push

npx cdk synth --context branch=${BRANCH} --context environmentId=${ENV_ID}
