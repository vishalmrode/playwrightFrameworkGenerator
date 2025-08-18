export interface EnvironmentValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface EnvironmentConfigOptions {
  includeCredentials?: boolean;
  includeCustomSettings?: boolean;
  requireHttps?: boolean;
}

export interface GeneratedEnvironmentConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  use: Record<string, any>;
  projects?: Array<{
    name: string;
    use: Record<string, any>;
  }>;
}