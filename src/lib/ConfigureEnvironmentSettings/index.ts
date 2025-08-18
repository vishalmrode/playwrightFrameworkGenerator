import { EnvironmentState, EnvironmentConfig } from '@/types/environment';

/**
 * Validates environment settings configuration
 */
export function validateEnvironmentSettings(state: EnvironmentState): boolean {
  // Must have at least one environment
  if (state.environments.length === 0) {
    return false;
  }

  // All environments must have valid names and base URLs
  for (const env of state.environments) {
    if (!env.name.trim() || !env.baseUrl.trim()) {
      return false;
    }
    
    // Validate base URL format
    try {
      new URL(env.baseUrl);
    } catch {
      return false;
    }
  }

  // Environment names must be unique
  const names = state.environments.map(env => env.name);
  const uniqueNames = new Set(names);
  if (names.length !== uniqueNames.size) {
    return false;
  }

  return true;
}

/**
 * Gets a description of the current environment settings
 */
export function getEnvironmentSettingsDescription(state: EnvironmentState): string {
  const envCount = state.environments.length;
  const selected = state.selectedEnvironments && state.selectedEnvironments.length > 0 ? state.selectedEnvironments.join(', ') : null;
  
  if (envCount === 0) {
    return 'No environments configured';
  }
  
  if (envCount === 1) {
    return `1 environment configured${selected ? ` (${selected} selected)` : ''}`;
  }
  
  return `${envCount} environments configured${selected ? ` (${selected} selected)` : ''}`;
}

/**
 * Validates a single environment configuration
 */
export function validateEnvironmentConfig(config: EnvironmentConfig): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.name.trim()) {
    errors.push('Environment name is required');
  }

  if (!config.baseUrl.trim()) {
    errors.push('Base URL is required');
  } else {
    try {
      new URL(config.baseUrl);
    } catch {
      errors.push('Base URL must be a valid URL');
    }
  }

  if (config.timeout && (config.timeout < 1000 || config.timeout > 300000)) {
    errors.push('Timeout must be between 1000ms and 300000ms');
  }

  if (config.retries && (config.retries < 0 || config.retries > 10)) {
    errors.push('Retries must be between 0 and 10');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Gets the default environment configuration for a new environment
 */
export function getDefaultEnvironmentConfig(): EnvironmentConfig {
  return {
    name: '',
    baseUrl: '',
    timeout: 30000,
    retries: 1,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  };
}

/**
 * Generates Playwright configuration for environments
 */
export function generateEnvironmentConfig(state: EnvironmentState): {
  baseURL: string;
  timeout: number;
  retries: number;
  use: Record<string, any>;
  projects?: Array<{
    name: string;
    use: Record<string, any>;
  }>;
} {
  // If multiple environments are selected, create projects for each selected environment
  const selectedNames = state.selectedEnvironments && state.selectedEnvironments.length > 0
    ? state.selectedEnvironments
    : [state.environments[0]?.name].filter(Boolean) as string[];

  const projects = selectedNames.map(name => {
    const e = state.environments.find(env => env.name === name) || state.environments[0]!;
    return {
      name: e.name,
      use: {
        baseURL: e.baseUrl,
        headless: e.headless ?? true,
        screenshot: e.screenshot || 'only-on-failure',
        video: e.video || 'retain-on-failure',
      }
    };
  });

  // If only one project, return top-level config for convenience
  if (projects.length === 1) {
    const p = projects[0];
    return {
      baseURL: p.use.baseURL,
      timeout: state.environments.find(env => env.name === p.name)?.timeout || 30000,
      retries: state.environments.find(env => env.name === p.name)?.retries || 1,
      use: p.use,
    };
  }

  // Multiple projects
  return {
    baseURL: projects[0].use.baseURL,
    timeout: state.environments.find(env => env.name === projects[0].name)?.timeout || 30000,
    retries: state.environments.find(env => env.name === projects[0].name)?.retries || 1,
    use: projects[0].use,
    projects: projects.map(p => ({ name: p.name, use: p.use })),
  };
}