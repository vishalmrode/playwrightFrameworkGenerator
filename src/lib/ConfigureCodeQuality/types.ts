import { CodeQualitySettings } from '@/types/codeQuality';

export interface ESLintConfiguration {
  extends: string[];
  parser?: string;
  parserOptions?: {
    ecmaVersion: number;
    sourceType: string;
    project?: string;
  };
  plugins: string[];
  rules: Record<string, any>;
  env?: {
    browser?: boolean;
    node?: boolean;
    es6?: boolean;
  };
  ignorePatterns?: string[];
}

export interface PrettierConfiguration {
  tabWidth: number;
  semi: boolean;
  singleQuote: boolean;
  trailingComma: 'none' | 'es5' | 'all';
  printWidth: number;
  useTabs?: boolean;
  quoteProps?: 'as-needed' | 'consistent' | 'preserve';
  bracketSpacing?: boolean;
  bracketSameLine?: boolean;
  arrowParens?: 'avoid' | 'always';
  endOfLine?: 'lf' | 'crlf' | 'cr' | 'auto';
}

export interface TypeScriptConfiguration {
  compilerOptions: {
    target: string;
    module: string;
    moduleResolution: string;
    lib: string[];
    outDir: string;
    rootDir: string;
    strict: boolean;
    esModuleInterop: boolean;
    skipLibCheck: boolean;
    forceConsistentCasingInFileNames: boolean;
    resolveJsonModule: boolean;
    allowSyntheticDefaultImports: boolean;
    exactOptionalPropertyTypes?: boolean;
    noUncheckedIndexedAccess?: boolean;
    noImplicitOverride?: boolean;
    declaration?: boolean;
    declarationMap?: boolean;
    sourceMap?: boolean;
  };
  include: string[];
  exclude: string[];
}

export interface PackageJsonScripts {
  lint?: string;
  'lint:fix'?: string;
  format?: string;
  'format:check'?: string;
  'type-check'?: string;
}

export interface GeneratedFiles {
  '.eslintrc.json'?: string;
  '.prettierrc.json'?: string;
  '.prettierignore'?: string;
  'tsconfig.json'?: string;
  packageScripts?: PackageJsonScripts;
}

export interface CodeQualityConfiguration {
  settings: CodeQualitySettings;
  files: GeneratedFiles;
  dependencies: {
    devDependencies: string[];
    optionalDependencies?: string[];
  };
}