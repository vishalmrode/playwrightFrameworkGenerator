import { ProgrammingLanguage } from "@/types/language";

export function getLanguageExtension(language: ProgrammingLanguage): string {
  return language === 'typescript' ? 'ts' : 'js';
}

export function getLanguageLabel(language: ProgrammingLanguage): string {
  return language === 'typescript' ? 'TypeScript' : 'JavaScript';
}

export function supportsTypeChecking(language: ProgrammingLanguage): boolean {
  return language === 'typescript';
}

export const getLanguageFileExtension = getLanguageExtension;
export const getLanguageExtensions = getLanguageExtension;
