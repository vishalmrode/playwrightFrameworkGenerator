export interface DockerOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'base' | 'build' | 'runtime' | 'orchestration';
  recommended?: boolean;
  advanced?: boolean;
}

export interface DockerConfigurationGroup {
  title: string;
  description: string;
  options: DockerConfigurationOption[];
}

export interface DockerConfigurationOption {
  key: string;
  label: string;
  description?: string;
  type: 'boolean' | 'string' | 'number' | 'select' | 'multiselect';
  options?: { value: string; label: string; description?: string }[];
  defaultValue?: any;
  validation?: (value: any) => boolean | string;
  dependency?: string;
}

export interface DockerfileTemplate {
  baseImage: string;
  workdir: string;
  copyFiles: string[];
  runCommands: string[];
  exposePort?: number;
  healthCheck?: {
    command: string;
    interval: string;
    timeout: string;
    retries: number;
  };
  volumes?: string[];
  environment?: Record<string, string>;
}

export interface DockerComposeService {
  image?: string;
  build?: {
    context: string;
    dockerfile: string;
  };
  volumes?: string[];
  environment?: Record<string, string>;
  ports?: string[];
  depends_on?: string[];
  healthcheck?: {
    test: string[];
    interval: string;
    timeout: string;
    retries: number;
    start_period: string;
  };
  mem_limit?: string;
  cpus?: string;
}

export interface DockerComposeConfig {
  version: string;
  services: Record<string, DockerComposeService>;
  volumes?: Record<string, any>;
  networks?: Record<string, any>;
}

export const DOCKER_BASE_IMAGES = [
  {
    value: 'playwright',
    label: 'Microsoft Playwright',
    image: 'mcr.microsoft.com/playwright:v1.40.0-jammy',
    description: 'Official Playwright image with all browsers',
    size: '~2.5GB',
    recommended: true,
  },
  {
    value: 'node-playwright',
    label: 'Node.js + Playwright',
    image: 'node:18-alpine',
    description: 'Lightweight Node.js with Playwright installation',
    size: '~1.8GB',
  },
  {
    value: 'custom',
    label: 'Custom Base Image',
    image: '',
    description: 'Specify your own Docker base image',
    size: 'Variable',
  },
] as const;

export const DOCKER_COMPOSE_SERVICES = [
  {
    id: 'postgres',
    name: 'PostgreSQL',
    image: 'postgres:15-alpine',
    description: 'PostgreSQL database for testing',
    ports: ['5432:5432'],
    environment: {
      POSTGRES_DB: 'testdb',
      POSTGRES_USER: 'testuser',
      POSTGRES_PASSWORD: 'testpass',
    },
  },
  {
    id: 'redis',
    name: 'Redis',
    image: 'redis:7-alpine',
    description: 'Redis cache for testing',
    ports: ['6379:6379'],
  },
  {
    id: 'selenium',
    name: 'Selenium Grid',
    image: 'selenium/standalone-chrome:latest',
    description: 'Selenium WebDriver for cross-browser testing',
    ports: ['4444:4444'],
    environment: {
      SE_OPTS: '--session-timeout 300',
    },
  },
] as const;