export type ProgrammingLanguage = 'typescript' | 'javascript' | 'python' | 'csharp' | 'java';

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
  {
    value: 'python',
    label: 'Python',
    description: 'Popular for automation, scripting, and data science',
  },
  {
    value: 'csharp',
    label: 'C#',
    description: 'Great for .NET and enterprise automation',
  },
  {
    value: 'java',
    label: 'Java',
    description: 'Widely used for enterprise and cross-platform automation',
  },
] as const;