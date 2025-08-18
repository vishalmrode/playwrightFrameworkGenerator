export type DockerBaseImage = 'playwright' | 'node-playwright' | 'custom';

export type DockerMemoryLimit = '1g' | '2g' | '4g' | '8g';
export type DockerCpuLimit = '1' | '2' | '4' | '8';

export interface DockerFeatures {
  dockerCompose: boolean;
  multiStage: boolean;
  healthChecks: boolean;
}

export interface DockerResources {
  memoryLimit: DockerMemoryLimit;
  cpuLimit: DockerCpuLimit;
}

export interface DockerConfig {
  enabled: boolean;
  baseImage: DockerBaseImage;
  customImage?: string;
  features: DockerFeatures;
  resources: DockerResources;
}

export interface DockerState {
  config: DockerConfig;
}

export const DEFAULT_DOCKER_CONFIG: DockerConfig = {
  enabled: false,
  baseImage: 'playwright',
  features: {
    dockerCompose: true,
    multiStage: false,
    healthChecks: false,
  },
  resources: {
    memoryLimit: '2g',
    cpuLimit: '2',
  },
};

export interface DockerImageOption {
  value: DockerBaseImage;
  label: string;
  description: string;
  image: string;
  // Optional architecture hint: 'multi' = multi-arch (arm64+x86), 'x86' = x86-only
  arch?: 'multi' | 'x86';
}

export const DOCKER_IMAGE_OPTIONS: DockerImageOption[] = [
  {
    value: 'playwright',
    label: 'Microsoft Playwright',
    description: 'Official Playwright image with all browsers pre-installed',
    image: 'mcr.microsoft.com/playwright',
    arch: 'multi',
  },
  {
    value: 'node-playwright',
    label: 'Node.js + Playwright',
    description: 'Node.js base image with Playwright installation',
    image: 'node:18-playwright',
    arch: 'multi',
  },
  {
    value: 'custom',
    label: 'Custom Image',
    description: 'Specify your own base Docker image',
    image: 'custom',
    arch: undefined,
  },
] as const;

export interface DockerFeatureOption {
  key: keyof DockerFeatures;
  label: string;
  description: string;
  icon: string;
  recommended?: boolean;
}

export const DOCKER_FEATURE_OPTIONS: DockerFeatureOption[] = [
  {
    key: 'dockerCompose',
    label: 'Docker Compose',
    description: 'Generate docker-compose.yml for easy container orchestration',
    icon: 'Layers',
    recommended: true,
  },
  {
    key: 'multiStage',
    label: 'Multi-stage Build',
    description: 'Optimize image size with multi-stage Dockerfile',
    icon: 'GitBranch',
  },
  {
    key: 'healthChecks',
    label: 'Health Checks',
    description: 'Add container health check endpoints',
    icon: 'Heart',
  },
];

export interface DockerResourceOption {
  value: string;
  label: string;
  description?: string;
}

export const DOCKER_MEMORY_OPTIONS: DockerResourceOption[] = [
  { value: '1g', label: '1GB', description: 'Minimal resources for basic tests' },
  { value: '2g', label: '2GB', description: 'Recommended for most test suites' },
  { value: '4g', label: '4GB', description: 'For complex or parallel test execution' },
  { value: '8g', label: '8GB', description: 'For intensive testing workloads' },
];

export const DOCKER_CPU_OPTIONS: DockerResourceOption[] = [
  { value: '1', label: '1 CPU', description: 'Single core execution' },
  { value: '2', label: '2 CPUs', description: 'Recommended for parallel tests' },
  { value: '4', label: '4 CPUs', description: 'High parallelism' },
  { value: '8', label: '8 CPUs', description: 'Maximum performance' },
];