export type ESLintConfig = 'recommended' | 'strict' | 'minimal' | 'custom';
export type TypeScriptTarget = 'es2020' | 'es2021' | 'es2022' | 'esnext';
export type PrettierConfig = 'default' | 'compact' | 'expanded' | 'custom';

export interface CodeQualitySettings {
  eslint: {
    enabled: boolean;
    config: ESLintConfig;
    plugins: string[];
    customRules: Record<string, any>;
  };
  prettier: {
    enabled: boolean;
    config: PrettierConfig;
    tabWidth: number;
    semi: boolean;
    singleQuote: boolean;
    trailingComma: 'none' | 'es5' | 'all';
    printWidth: number;
  };
  typescript: {
    strict: boolean;
    target: TypeScriptTarget;
    exactOptionalPropertyTypes: boolean;
    noUncheckedIndexedAccess: boolean;
    noImplicitOverride: boolean;
  };
}

export interface ESLintConfigOption {
  value: ESLintConfig;
  label: string;
  description: string;
  rules: Record<string, any>;
}

export interface PrettierConfigOption {
  value: PrettierConfig;
  label: string;
  description: string;
  settings: Partial<CodeQualitySettings['prettier']>;
}

export interface TypeScriptTargetOption {
  value: TypeScriptTarget;
  label: string;
  description: string;
  moduleResolution?: string;
  lib?: string[];
}

export const ESLINT_CONFIGS: ESLintConfigOption[] = [
  {
    value: 'recommended',
    label: 'Recommended',
    description: 'Standard ESLint rules for most projects',
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    value: 'strict',
    label: 'Strict',
    description: 'Strict rules for maximum code quality',
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'warn',
    },
  },
  {
    value: 'minimal',
    label: 'Minimal',
    description: 'Basic rules for simple projects',
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Define your own rules',
    rules: {},
  },
] as const;

export const PRETTIER_CONFIGS: PrettierConfigOption[] = [
  {
    value: 'default',
    label: 'Default',
    description: 'Standard Prettier formatting',
    settings: {
      tabWidth: 2,
      semi: true,
      singleQuote: false,
      trailingComma: 'es5',
      printWidth: 80,
    },
  },
  {
    value: 'compact',
    label: 'Compact',
    description: 'More compact formatting style',
    settings: {
      tabWidth: 2,
      semi: true,
      singleQuote: true,
      trailingComma: 'all',
      printWidth: 120,
    },
  },
  {
    value: 'expanded',
    label: 'Expanded',
    description: 'More spacious formatting style',
    settings: {
      tabWidth: 4,
      semi: true,
      singleQuote: false,
      trailingComma: 'es5',
      printWidth: 100,
    },
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'Define your own formatting preferences',
    settings: {},
  },
] as const;

export const TYPESCRIPT_TARGETS: TypeScriptTargetOption[] = [
  {
    value: 'es2020',
    label: 'ES2020',
    description: 'Compatible with Node 14+ and modern browsers',
    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
  },
  {
    value: 'es2021',
    label: 'ES2021',
    description: 'Compatible with Node 16+ and latest browsers',
    lib: ['ES2021', 'DOM', 'DOM.Iterable'],
  },
  {
    value: 'es2022',
    label: 'ES2022',
    description: 'Latest stable features (recommended)',
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
  },
  {
    value: 'esnext',
    label: 'ESNext',
    description: 'Cutting-edge features (may change)',
    lib: ['ESNext', 'DOM', 'DOM.Iterable'],
  },
] as const;