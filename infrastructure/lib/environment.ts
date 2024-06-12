import { Construct } from 'constructs';
import deepmerge from 'deepmerge';
import path from 'path';
import { CoreEnvironment, EnvConfig, PartialEnvConfig, coreEnvIds, envConfigs } from '../config/environment-config';
import * as FeatureConfigTemplate from '../config/environment-config-feature.template';
import { CTX_ENV_ID } from './context';

/**
 * Checks if the given environment ID is one of the core environment IDs.
 *
 * @param envId the environment Id to check
 * @returns true if the environment Id is one of the core environment IDs, else false
 */
export const isCoreEnvId = (envId: unknown): envId is CoreEnvironment =>
  typeof envId === 'string' && coreEnvIds.includes(envId as CoreEnvironment);

/**
 * A feature environment is considered as one without a defined configuration stored.
 * This is typically used for feature branches and other temporary environments.
 * This function will check if the given environment ID can be considered a 'feature' environment ID.
 *
 * @param envId the environment Id to check
 * @returns true if the environment Id is not defined in the fixed environment configurations, else false
 */
export const isFeatureEnvId = (envId: string): boolean => !Object.keys(envConfigs).includes(envId);

export const FEATURE_ENV_CONFIG_ENV_VAR_NAME = 'FEATURE_ENV_CONFIG';

/**
 * Loads the feature environment configuration for the given environment ID.
 * This will be loaded from a temporary local configuration file when running locally,
 * and from an environment variable when running in a pipeline / CodeBuild environment.
 *
 * When loaded locally, the (partial) feature environment configuration will be merged with the development environment configuration,
 * using development config as default values for any missing feature environment values.
 * Arrays will be overwritten entirely with the feature environment's arrays, not merged in-place.
 *
 * @param environmentId the environment Id to load the configuration for
 * @returns the feature environment configuration
 */
const loadFeatureEnvConfig = (environmentId: string): EnvConfig => {
  // When running locally, the feature configuration will be loaded from a temporary local configuration file.
  // However, these temporary configuration files should not be configured to git (as they will be developer/feature specific)
  // When running in a pipeline / CodeBuild environment, the locally-loaded configuration will be persisted by storing it as an environment variable,
  // and so should be loaded from such instead.
  // We do not want to do this for environments with defined configuration as we would want the pipelines for these to self-mutate as needed with the
  // configuration from version control.
  if (process.env.CODEBUILD_BUILD_ID) {
    if (process.env[FEATURE_ENV_CONFIG_ENV_VAR_NAME]) {
      return JSON.parse(process.env[FEATURE_ENV_CONFIG_ENV_VAR_NAME]);
    }
    // Safety catch in case the configuration has not been persisted as an environment variable in the CodeBuild project
    throw new Error(
      `No feature environment config stored in CodeBuild environment for feature environment Id: ${environmentId} `
    );
  } else {
    try {
      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires, import/no-dynamic-require
      const featureConfigModule: typeof FeatureConfigTemplate = require(path.join(
        __dirname,
        `..`,
        `config`,
        `environment-config-feature.${environmentId}.ts`
      ));

      return deepmerge<EnvConfig, PartialEnvConfig>(envConfigs.dev, featureConfigModule.featureEnvConfig, {
        // Overwrite default arrays with environment specific arrays
        arrayMerge: (destinationArray, sourceArray) => sourceArray,
      });
    } catch (e) {
      throw new Error(`No feature environment config found for feature environment Id: ${environmentId}`);
    }
  }
};

/**
 * Returns the environment config for the current environment from the context of the given scope.
 * If a config is not defined for an environment, the dev config will be returned.
 *
 * @param scope the construct to get the environment config in-scope for
 * @returns the resolved feature environment configuration
 */
export const getEnvConfig = (scope: Construct): EnvConfig => {
  const environmentId: string = scope.node.getContext(CTX_ENV_ID);

  if (isFeatureEnvId(environmentId)) {
    // Config is not configured in the fixed environment configurations (i.e. committed to version control)
    // So treat as a feature environment and use the feature environment config which is not committed
    return loadFeatureEnvConfig(environmentId);
  }

  // We should never be in a situation where the environment ID is not for a feature environment
  // and environment configuration is not defined in the fixed environment configurations, but lets
  // do a safety check just in case.
  if (!envConfigs[environmentId]) {
    throw new Error(`No environment config found for environment Id: ${environmentId}`);
  }
  return envConfigs[environmentId];
};
