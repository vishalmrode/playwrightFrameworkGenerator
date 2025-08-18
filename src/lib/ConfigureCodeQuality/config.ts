import { 
  ESLintConfiguration, 
  PrettierConfiguration, 
  TypeScriptConfiguration,
  PackageJsonScripts 
} from './types';
import { CodeQualitySettings, ESLINT_CONFIGS, PRETTIER_CONFIGS } from '@/types/codeQuality';

/**
 * Generate ESLint configuration based on settings
 */
export function generateESLintConfig(settings: CodeQualitySettings['eslint']): ESLintConfiguration {
  const baseConfig: ESLintConfiguration = {
    extends: [
      'eslint:recommended',
    ],
    plugins: [...settings.plugins],
    rules: { ...settings.customRules },
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    ignorePatterns: [
      'node_modules/',
      'dist/',
      'build/',
      'coverage/',
      '*.min.js',
      'test-results/',
      'playwright-report/',
    ],
  };

  // Add TypeScript configuration if TypeScript plugin is present
  if (settings.plugins.includes('@typescript-eslint')) {
    baseConfig.extends.push('@typescript-eslint/recommended');
    baseConfig.parser = '@typescript-eslint/parser';
    baseConfig.parserOptions = {
      ecmaVersion: 2022,
      sourceType: 'module',
      project: './tsconfig.json',
    };
  }

  // Add Playwright specific configuration
  if (settings.plugins.includes('@playwright/recommended')) {
    baseConfig.extends.push('plugin:@playwright/recommended');
  }

  // Apply preset configuration rules
  const configPreset = ESLINT_CONFIGS.find(config => config.value === settings.config);
  if (configPreset) {
    baseConfig.rules = { ...baseConfig.rules, ...configPreset.rules };
  }

  return baseConfig;
}

/**
 * Generate Prettier configuration based on settings
 */
export function generatePrettierConfig(settings: CodeQualitySettings['prettier']): PrettierConfiguration {
  const baseConfig: PrettierConfiguration = {
    tabWidth: settings.tabWidth,
    semi: settings.semi,
    singleQuote: settings.singleQuote,
    trailingComma: settings.trailingComma,
    printWidth: settings.printWidth,
    useTabs: false,
    quoteProps: 'as-needed',
    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'avoid',
    endOfLine: 'lf',
  };

  // Apply preset configuration
  const configPreset = PRETTIER_CONFIGS.find(config => config.value === settings.config);
  if (configPreset && configPreset.settings) {
    Object.assign(baseConfig, configPreset.settings);
  }

  return baseConfig;
}

/**
 * Generate TypeScript configuration based on settings
 */
export function generateTypeScriptConfig(settings: CodeQualitySettings['typescript']): TypeScriptConfiguration {
  const baseConfig: TypeScriptConfiguration = {
    compilerOptions: {
      target: settings.target,
      module: 'ESNext',
      moduleResolution: 'node',
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      outDir: './dist',
      rootDir: './src',
      strict: settings.strict,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      resolveJsonModule: true,
      allowSyntheticDefaultImports: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
    },
    include: [
      'src/**/*',
      'tests/**/*',
      'playwright.config.ts',
    ],
    exclude: [
      'node_modules',
      'dist',
      'build',
      'coverage',
    ],
  };

  // Add strict type checking options
  if (settings.exactOptionalPropertyTypes) {
    baseConfig.compilerOptions.exactOptionalPropertyTypes = true;
  }

  if (settings.noUncheckedIndexedAccess) {
    baseConfig.compilerOptions.noUncheckedIndexedAccess = true;
  }

  if (settings.noImplicitOverride) {
    baseConfig.compilerOptions.noImplicitOverride = true;
  }

  return baseConfig;
}

/**
 * Generate package.json scripts for code quality tools
 */
export function generatePackageScripts(settings: CodeQualitySettings): PackageJsonScripts {
  const scripts: PackageJsonScripts = {};

  if (settings.eslint.enabled) {
    scripts.lint = 'eslint . --ext .ts,.tsx,.js,.jsx';
    scripts['lint:fix'] = 'eslint . --ext .ts,.tsx,.js,.jsx --fix';
  }

  if (settings.prettier.enabled) {
    scripts.format = 'prettier --write "**/*.{ts,tsx,js,jsx,json,css,md}"';
    scripts['format:check'] = 'prettier --check "**/*.{ts,tsx,js,jsx,json,css,md}"';
  }

  // Add type checking script for TypeScript projects
  scripts['type-check'] = 'tsc --noEmit';

  return scripts;
}

/**
 * Generate .prettierignore content
 */
export function generatePrettierIgnore(): string {
  return `# Dependencies
node_modules/

# Build outputs
dist/
build/
coverage/

# Generated files
*.min.js
*.min.css

# Test results
test-results/
playwright-report/

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
`;
}

/**
 * Get required dev dependencies based on enabled tools
 */
export function getRequiredDependencies(settings: CodeQualitySettings): {
  devDependencies: string[];
  optionalDependencies: string[];
} {
  const devDependencies: string[] = [];
  const optionalDependencies: string[] = [];

  if (settings.eslint.enabled) {
    devDependencies.push(
      'eslint',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser'
    );

    if (settings.eslint.plugins.includes('@playwright/recommended')) {
      devDependencies.push('eslint-plugin-playwright');
    }

    // Add Prettier ESLint integration if both are enabled
    if (settings.prettier.enabled) {
      devDependencies.push(
        'eslint-config-prettier',
        'eslint-plugin-prettier'
      );
    }
  }

  if (settings.prettier.enabled) {
    devDependencies.push('prettier');
  }

  // TypeScript is typically already included in Playwright projects
  optionalDependencies.push('typescript');

  return {
    devDependencies: [...new Set(devDependencies)], // Remove duplicates
    optionalDependencies: [...new Set(optionalDependencies)],
  };
}

/**
 * Generate installation command for dependencies
 */
export function generateInstallCommand(dependencies: string[]): string {
  if (dependencies.length === 0) return '';
  
  return `npm install --save-dev ${dependencies.join(' ')}`;
}

/**
 * Generate setup instructions
 */
export function generateSetupInstructions(settings: CodeQualitySettings): string[] {
  const instructions: string[] = [];

  if (settings.eslint.enabled || settings.prettier.enabled) {
    instructions.push('1. Install the required dependencies using the command above');
  }

  if (settings.eslint.enabled) {
    instructions.push('2. Configure your IDE to use ESLint for real-time feedback');
    instructions.push('3. Run `npm run lint` to check for issues');
    instructions.push('4. Run `npm run lint:fix` to auto-fix issues');
  }

  if (settings.prettier.enabled) {
    instructions.push('5. Configure your IDE to format on save using Prettier');
    instructions.push('6. Run `npm run format` to format all files');
    instructions.push('7. Run `npm run format:check` to check formatting');
  }

  instructions.push('8. Run `npm run type-check` to validate TypeScript types');

  return instructions;
}