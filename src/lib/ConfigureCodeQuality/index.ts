import type { CodeQualitySettings } from '@/types/codeQuality';
import type {
  CodeQualityConfiguration, 
  GeneratedFiles,
} from './types';
import {
  generateESLintConfig,
  generatePrettierConfig,
  generateTypeScriptConfig,
  generatePackageScripts,
  generatePrettierIgnore,
  getRequiredDependencies,
  generateInstallCommand,
  generateSetupInstructions,
} from './config';

/**
 * Generate complete code quality configuration
 */
export function generateCodeQualityConfiguration(settings: CodeQualitySettings): CodeQualityConfiguration {
  const files: GeneratedFiles = {};
  
  // Generate ESLint configuration
  if (settings.eslint.enabled) {
    const eslintConfig = generateESLintConfig(settings.eslint);
    files['.eslintrc.json'] = JSON.stringify(eslintConfig, null, 2);
  }

  // Generate Prettier configuration
  if (settings.prettier.enabled) {
    const prettierConfig = generatePrettierConfig(settings.prettier);
    files['.prettierrc.json'] = JSON.stringify(prettierConfig, null, 2);
    files['.prettierignore'] = generatePrettierIgnore();
  }

  // Generate TypeScript configuration
  const tsConfig = generateTypeScriptConfig(settings.typescript);
  files['tsconfig.json'] = JSON.stringify(tsConfig, null, 2);

  // Generate package.json scripts
  files.packageScripts = generatePackageScripts(settings);

  // Get required dependencies
  const dependencies = getRequiredDependencies(settings);

  return {
    settings,
    files,
    dependencies,
  };
}

/**
 * Generate configuration files as downloadable content
 */
export function generateConfigurationFiles(settings: CodeQualitySettings): { [filename: string]: string } {
  const config = generateCodeQualityConfiguration(settings);
  const files: { [filename: string]: string } = {};

  // Add all generated files
  Object.entries(config.files).forEach(([filename, content]) => {
    if (typeof content === 'string') {
      files[filename] = content;
    }
  });

  return files;
}

/**
 * Generate README section for code quality setup
 */
export function generateReadmeSection(settings: CodeQualitySettings): string {
  const config = generateCodeQualityConfiguration(settings);
  const installCmd = generateInstallCommand(config.dependencies.devDependencies);
  const instructions = generateSetupInstructions(settings);

  let readme = `## Code Quality Configuration

This project includes the following code quality tools:
`;

  if (settings.eslint.enabled) {
    readme += `
### ESLint
- Configuration: ${settings.eslint.config}
- Plugins: ${settings.eslint.plugins.join(', ')}
- Lints TypeScript and JavaScript files
- Catches common errors and enforces coding standards
`;
  }

  if (settings.prettier.enabled) {
    readme += `
### Prettier
- Configuration: ${settings.prettier.config}
- Print Width: ${settings.prettier.printWidth}
- Tab Width: ${settings.prettier.tabWidth}
- Semi: ${settings.prettier.semi}
- Single Quote: ${settings.prettier.singleQuote}
- Trailing Comma: ${settings.prettier.trailingComma}
- Automatically formats code for consistency
`;
  }

  readme += `
### TypeScript
- Target: ${settings.typescript.target.toUpperCase()}
- Strict Mode: ${settings.typescript.strict ? 'Enabled' : 'Disabled'}
- Type checking and compilation
`;

  if (settings.typescript.exactOptionalPropertyTypes) {
    readme += `- Exact Optional Property Types: Enabled
`;
  }

  if (settings.typescript.noUncheckedIndexedAccess) {
    readme += `- No Unchecked Indexed Access: Enabled
`;
  }

  if (settings.typescript.noImplicitOverride) {
    readme += `- No Implicit Override: Enabled
`;
  }

  if (installCmd) {
    readme += `
### Installation

Install the required dependencies:

\`\`\`bash
${installCmd}
\`\`\`
`;
  }

  readme += `
### Usage

`;

  instructions.forEach((instruction) => {
    readme += `${instruction}
`;
  });

  readme += `
### IDE Integration

For the best experience, configure your IDE:

- **VS Code**: Install the ESLint and Prettier extensions
- **WebStorm/IntelliJ**: Enable ESLint and Prettier in settings
- **Vim/Neovim**: Use appropriate plugins for ESLint and Prettier

### Scripts

The following npm scripts are available:
`;

  if (config.files.packageScripts) {
    Object.entries(config.files.packageScripts).forEach(([script, command]) => {
      readme += `
- \`npm run ${script}\`: ${command}`;
    });
  }

  return readme;
}

/**
 * Get configuration summary for display
 */
export function getConfigurationSummary(settings: CodeQualitySettings): {
  enabled: string[];
  disabled: string[];
  details: { [key: string]: any };
} {
  const enabled: string[] = [];
  const disabled: string[] = [];
  const details: { [key: string]: any } = {};

  // ESLint
  if (settings.eslint.enabled) {
    enabled.push('ESLint');
    details.ESLint = {
      config: settings.eslint.config,
      plugins: settings.eslint.plugins.length,
    };
  } else {
    disabled.push('ESLint');
  }

  // Prettier
  if (settings.prettier.enabled) {
    enabled.push('Prettier');
    details.Prettier = {
      config: settings.prettier.config,
      printWidth: settings.prettier.printWidth,
      tabWidth: settings.prettier.tabWidth,
    };
  } else {
    disabled.push('Prettier');
  }

  // TypeScript
  enabled.push('TypeScript');
  details.TypeScript = {
    strict: settings.typescript.strict,
    target: settings.typescript.target,
    additionalChecks: [
      settings.typescript.exactOptionalPropertyTypes && 'exactOptionalPropertyTypes',
      settings.typescript.noUncheckedIndexedAccess && 'noUncheckedIndexedAccess',
      settings.typescript.noImplicitOverride && 'noImplicitOverride',
    ].filter(Boolean),
  };

  return { enabled, disabled, details };
}

/**
 * Validate code quality configuration
 */
export function validateConfiguration(settings: CodeQualitySettings): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if any tools are enabled
  if (!settings.eslint.enabled && !settings.prettier.enabled) {
    warnings.push('No code quality tools enabled - consider enabling ESLint or Prettier for better code consistency');
  }

  // ESLint validations
  if (settings.eslint.enabled) {
    if (settings.eslint.plugins.length === 0) {
      warnings.push('No ESLint plugins configured - consider adding @typescript-eslint or @playwright/recommended');
    }

    if (settings.eslint.config === 'custom' && Object.keys(settings.eslint.customRules).length === 0) {
      warnings.push('Custom ESLint configuration selected but no custom rules defined');
    }
  }

  // Prettier validations
  if (settings.prettier.enabled) {
    if (settings.prettier.printWidth < 40 || settings.prettier.printWidth > 200) {
      warnings.push(`Print width of ${settings.prettier.printWidth} is unusual - consider a value between 80-120`);
    }

    if (settings.prettier.tabWidth < 1 || settings.prettier.tabWidth > 8) {
      warnings.push(`Tab width of ${settings.prettier.tabWidth} is unusual - consider 2 or 4 spaces`);
    }
  }

  // TypeScript validations
  if (!settings.typescript.strict && settings.typescript.exactOptionalPropertyTypes) {
    warnings.push('exactOptionalPropertyTypes requires strict mode to be effective');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export * from './types';
export * from './config';