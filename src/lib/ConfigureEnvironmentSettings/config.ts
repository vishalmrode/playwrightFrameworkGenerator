export const ENVIRONMENT_DEFAULTS = {
  timeout: 30000,
  retries: 1,
  headless: true,
  screenshot: 'only-on-failure' as const,
  video: 'retain-on-failure' as const,
};

export const ENVIRONMENT_LIMITS = {
  minTimeout: 1000,
  maxTimeout: 300000,
  minRetries: 0,
  maxRetries: 10,
  maxEnvironments: 10,
  maxNameLength: 50,
};

export const SCREENSHOT_OPTIONS = [
  { value: 'off', label: 'Off', description: 'No screenshots' },
  { value: 'only-on-failure', label: 'Only on Failure', description: 'Screenshot only when tests fail' },
  { value: 'on', label: 'Always On', description: 'Screenshot for all tests' },
] as const;

export const VIDEO_OPTIONS = [
  { value: 'off', label: 'Off', description: 'No video recording' },
  { value: 'on-first-retry', label: 'On First Retry', description: 'Record video starting from first retry' },
  { value: 'retain-on-failure', label: 'Retain on Failure', description: 'Keep video only for failed tests' },
  { value: 'on', label: 'Always On', description: 'Record video for all tests' },
] as const;

export const COMMON_ENVIRONMENTS = [
  {
    name: 'local',
    baseUrl: 'http://localhost:3000',
    description: 'Local development server',
  },
  {
    name: 'development',
    baseUrl: 'https://dev.example.com',
    description: 'Development environment',
  },
  {
    name: 'staging',
    baseUrl: 'https://staging.example.com',
    description: 'Staging environment',
  },
  {
    name: 'production',
    baseUrl: 'https://example.com',
    description: 'Production environment',
  },
] as const;