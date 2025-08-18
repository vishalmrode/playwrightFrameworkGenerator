import { ProgrammingLanguage } from '@/types/language';

export interface LanguageConfig {
  fileExtensions: string[];
  configFiles: string[];
  packageDependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

/**
 * Get the complete configuration for a programming language
 */
export const getLanguageConfig = (language: ProgrammingLanguage): LanguageConfig => {
  switch (language) {
    case 'typescript':
      return {
        fileExtensions: ['.ts', '.tsx'],
        configFiles: ['playwright.config.ts', 'tsconfig.json'],
        packageDependencies: ['@playwright/test'],
        devDependencies: ['typescript', '@types/node'],
        scripts: {
          'test': 'playwright test',
          'test:ui': 'playwright test --ui',
          'test:debug': 'playwright test --debug',
          'test:report': 'playwright show-report',
          'test:headed': 'playwright test --headed',
        },
      };
    case 'javascript':
      return {
        fileExtensions: ['.js', '.jsx'],
        configFiles: ['playwright.config.js'],
        packageDependencies: ['@playwright/test'],
        devDependencies: [],
        scripts: {
          'test': 'playwright test',
          'test:ui': 'playwright test --ui',
          'test:debug': 'playwright test --debug',
          'test:report': 'playwright show-report',
          'test:headed': 'playwright test --headed',
        },
      };
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
};

/**
 * Get the import/require syntax for a language
 */
export const getImportSyntax = (language: ProgrammingLanguage, module: string, imports: string[]): string => {
  if (language === 'typescript') {
    return `import { ${imports.join(', ')} } from '${module}';`;
  } else {
    return `const { ${imports.join(', ')} } = require('${module}');`;
  }
};

/**
 * Get the export syntax for a language
 */
export const getExportSyntax = (language: ProgrammingLanguage, name: string, isDefault = false): string => {
  if (language === 'typescript') {
    return isDefault ? `export default ${name};` : `export { ${name} };`;
  } else {
    return isDefault ? `module.exports = ${name};` : `module.exports.${name} = ${name};`;
  }
};