/**
 * COPY THE CONTENTS OF THIS FILE to a new file called environment-config-feature.<environment ID>.ts
 * and replace the values with the feature environment's configuration.
 *
 * The copied file should not be committed to version control.
 * Changes to this template file should be committed as appropriate.
 * Changes to the temporary copied file requires a manual redeployment of the pipeline to apply.
 */
import { PartialEnvConfig } from './environment-config';

/**
 * The (partial) configuration for the feature environment.
 * Values which are not explicitly specified will default to the development environment configuration.
 * Arrays will be overwritten entirely with the feature environment's arrays, not merged in-place.
 */
export const featureEnvConfig: PartialEnvConfig = {
  pipelines: {},
};
