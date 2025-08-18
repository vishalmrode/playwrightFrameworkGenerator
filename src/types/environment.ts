export interface EnvironmentConfig {
  name: string;
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headless?: boolean;
  screenshot?: 'off' | 'only-on-failure' | 'on';
  video?: 'off' | 'on-first-retry' | 'retain-on-failure' | 'on';
  credentials?: {
    username?: string;
    password?: string;
  };
  customSettings?: Record<string, string | number | boolean>;
}

export interface EnvironmentState {
  environments: EnvironmentConfig[];
  // Allow selecting multiple environments for generation and projects
  selectedEnvironments: string[];
}

export const DEFAULT_ENVIRONMENTS: EnvironmentConfig[] = [
  {
    name: 'development',
    baseUrl: 'http://localhost:3000',
    timeout: 30000,
    retries: 1,
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  {
    name: 'staging',
    baseUrl: 'https://staging.example.com',
    timeout: 30000,
    retries: 2,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  {
    name: 'production',
    baseUrl: 'https://example.com',
    timeout: 60000,
    retries: 3,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
  },
];