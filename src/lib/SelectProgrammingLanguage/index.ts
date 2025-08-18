// Main exports
export * from './types';
export * from './config';

import { ProgrammingLanguage, LANGUAGE_OPTIONS } from '@/types/language';

/**
 * Get the display label for a programming language
 */
export const getLanguageLabel = (language: ProgrammingLanguage): string => {
  const option = LANGUAGE_OPTIONS.find(opt => opt.value === language);
  return option?.label || language;
};

/**
 * Get the description for a programming language
 */
export const getLanguageDescription = (language: ProgrammingLanguage): string => {
  const option = LANGUAGE_OPTIONS.find(opt => opt.value === language);
  return option?.description || '';
};

/**
 * Check if a programming language is recommended
 */
export const isLanguageRecommended = (language: ProgrammingLanguage): boolean => {
  const option = LANGUAGE_OPTIONS.find(opt => opt.value === language);
  return option?.recommended || false;
};

/**
 * Get the file extensions for a programming language
 */
export const getLanguageExtensions = (language: ProgrammingLanguage): string[] => {
  switch (language) {
    case 'typescript':
      return ['.ts', '.tsx'];
    case 'javascript':
      return ['.js', '.jsx'];
    default:
      return [];
  }
};

/**
 * Get the configuration file names for a programming language
 */
export const getLanguageConfigFiles = (language: ProgrammingLanguage): string[] => {
  switch (language) {
    case 'typescript':
      return ['playwright.config.ts', 'tsconfig.json'];
    case 'javascript':
      return ['playwright.config.js'];
    default:
      return [];
  }
};

/**
 * Check if the language supports type checking
 */
export const supportsTypeChecking = (language: ProgrammingLanguage): boolean => {
  return language === 'typescript';
};