#!/bin/env bash
set -x

cd ${PROJECT_DIR}
npm ci
npm run test
npm run lint
set -e

npx cdk synth --context branch=${BRANCH} --context environmentId=${ENV_ID}
