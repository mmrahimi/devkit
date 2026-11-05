export type RestartPolicy = 'no' | 'always' | 'unless-stopped' | 'on-failure';

export type EnvironmentVariable = { key: string; value: string };

export type Dependency = {
  service: string;
  condition: 'service_started' | 'service_healthy' | 'service_completed_successfully';
};

export type ComposeService = {
  id: string;
  name: string;
  source: 'image' | 'build';
  image: string;
  buildContext: string;
  dockerfile: string;
  buildArgs: EnvironmentVariable[];
  buildTarget: string;
  ports: string[];
  environment: EnvironmentVariable[];
  volumes: string[];
  restart: RestartPolicy;
  dependencies: Dependency[];
  command: string;
  entrypoint: string;
  healthcheckTest: string;
  healthcheckDisabled: boolean;
  healthcheckInterval: string;
  healthcheckStartInterval: string;
  healthcheckTimeout: string;
  healthcheckRetries: string;
  healthcheckStartPeriod: string;
  networks: string;
};

export type ServicePreset = {
  name: string;
  image: string;
  ports?: string[];
  environment?: EnvironmentVariable[];
  volumes?: string[];
};

export type WorkspaceTab = 'configure' | 'compose';
