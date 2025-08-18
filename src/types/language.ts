export type ProgrammingLanguage = 'typescript' | 'javascript';

export interface LanguageOption {
  value: ProgrammingLanguage;
  label: string;
  description: string;
  recommended?: boolean;
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    value: 'typescript',
    label: 'TypeScript',
    description: 'Recommended for type safety and modern development',
    recommended: true,
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    description: 'Classic JavaScript for simpler setup',
  },
] as const;