export interface IntegrationOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'ci-cd' | 'reporting' | 'testing' | 'data';
  popular?: boolean;
  dependencies?: string[];
}

export interface ConfigurationGroup {
  title: string;
  description: string;
  options: ConfigurationOption[];
}

export interface ConfigurationOption {
  key: string;
  label: string;
  description?: string;
  type: 'boolean' | 'string' | 'number' | 'array' | 'select';
  options?: { value: string; label: string }[];
  defaultValue?: any;
  validation?: (value: any) => boolean | string;
}

export const FAKER_LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
] as const;

export const NODE_VERSIONS = [
  { value: '16.x', label: 'Node.js 16' },
  { value: '18.x', label: 'Node.js 18 (LTS)' },
  { value: '20.x', label: 'Node.js 20 (Current)' },
] as const;

export const OPERATING_SYSTEMS = [
  { value: 'ubuntu-latest', label: 'Ubuntu Latest' },
  { value: 'windows-latest', label: 'Windows Latest' },
  { value: 'macos-latest', label: 'macOS Latest' },
] as const;