#!/bin/env bash

# Fail build on any error
set -eu

echo "PROJECT_DIR: $PROJECT_DIR"

cd ${PROJECT_DIR/infrastructure}
npm ci
npm run lint
npm run test

npx cdk synth --context branch=${BRANCH} --context environmentId=${ENV_ID}