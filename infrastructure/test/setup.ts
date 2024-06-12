import { FEATURE_ENV_CONFIG_ENV_VAR_NAME } from '../lib/environment';
import { testEnvConfig } from './test-env-config';

beforeEach(() => {
  process.env.CODEBUILD_BUILD_ID = 'UnitTests';
  process.env[FEATURE_ENV_CONFIG_ENV_VAR_NAME] = JSON.stringify(testEnvConfig);
});

afterEach(() => {
  delete process.env[FEATURE_ENV_CONFIG_ENV_VAR_NAME];
});
