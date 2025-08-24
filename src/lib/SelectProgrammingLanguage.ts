import { ProgrammingLanguage } from "@/types/language";

export function getLanguageExtension(language: ProgrammingLanguage): string {
  switch (language) {
    case 'typescript':
      return 'ts';
    case 'javascript':
      return 'js';
    case 'python':
      return 'py';
    case 'csharp':
      return 'cs';
    case 'java':
      return 'java';
    default:
      return 'js';
  }
}

export function getLanguageLabel(language: ProgrammingLanguage): string {
  switch (language) {
    case 'typescript':
      return 'TypeScript';
    case 'javascript':
      return 'JavaScript';
    case 'python':
      return 'Python';
    case 'csharp':
      return 'C#';
    case 'java':
      return 'Java';
    default:
      return 'JavaScript';
  }
}

export function supportsTypeChecking(language: ProgrammingLanguage): boolean {
  return language === 'typescript' || language === 'csharp' || language === 'java';
}

export const getLanguageFileExtension = getLanguageExtension;
export const getLanguageExtensions = getLanguageExtension;
