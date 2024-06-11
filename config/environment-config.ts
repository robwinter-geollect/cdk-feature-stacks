export const coreEnvIds = ['dev', 'stage', 'prod'] as const;
export type CoreEnvironment = (typeof coreEnvIds)[number];

/**
 * This represents the configuration required for the deployment of the application to a specific environment.
 * See @see envConfigs for the permanently configured environments.
 */
export type EnvConfig = {
  pipelines: {
    codestarConnectionId: string;
  };
};

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type PartialEnvConfig = RecursivePartial<EnvConfig>;

const coreEnvConfigs: Record<CoreEnvironment, EnvConfig> = {
  dev: {
    pipelines: {
      codestarConnectionId: '4cae312c-b3fd-410b-81c9-a2af9a698089',
    },
  },
  stage: {
    pipelines: {
      codestarConnectionId: 'c2f73092-239c-49e3-b3ff-549b056f196a',
    },
  },
  prod: {
    pipelines: {
      codestarConnectionId: '86aa05b8-1407-470d-bc04-e3883af34322',
    },
  },
};

export const envConfigs: Record<string, EnvConfig> = {
  ...coreEnvConfigs,
  // Add any additional fixed environment configs here (e.g. long-running feature/trial deployments)
};
