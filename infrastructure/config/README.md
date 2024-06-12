# Environment Configuration

This directory contains the configuration files for the different environments. The configuration files are used to define the environment specific settings for different deployments (e.g. dev, stage, prod).

## Configuration Files

- `environment-config.ts`:
- - This file contains the configuration for permanently configured environments (e.g. for dev, stage, prod, and for long-running environments such as for trials)
- `environment-config-feature.template.ts`:
- - This file is the template for configuration for temporary, feature-level deployments.
- - This file should be copied and renamed to `environment-config-feature.<environment ID>.ts`, and the settings should be updated accordingly for the given feature environment.
- `environment-config-feature.<environment ID>.ts`:
- - This file contains the configuration for temporary, feature-level deployments.
- - This file should be created by copying the `environment-config-feature.template.ts` file and renaming it to `environment-config-feature.<environment ID>.ts`, and the settings should be updated accordingly for the given feature environment.
- - This file should **not** be committed to version control.
- - **NOTE** as this file is not committed to version control, changes to the configuration requires a manual re-deployment of the feature-environment pipeline stack to apply.
