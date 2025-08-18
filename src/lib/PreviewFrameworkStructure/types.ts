export interface ProjectFile {
  path: string;
  content: string;
  description?: string;
  category: 'config' | 'test' | 'page' | 'fixture' | 'util' | 'ci' | 'docker' | 'docs';
  language?: 'typescript' | 'javascript' | 'json' | 'yaml' | 'dockerfile' | 'shell';
}

export interface ProjectStructure {
  name: string;
  description: string;
  files: ProjectFile[];
  directories: string[];
  dependencies: string[];
  devDependencies: string[];
  scripts: Record<string, string>;
}

export interface PreviewConfiguration {
  language: 'typescript' | 'javascript';
  browsers: string[];
  capabilities: string[];
  environments: string[];
  integrations: string[];
  fixtures: string[];
  docker: boolean;
}

export interface GeneratedPreview {
  structure: ProjectStructure;
  highlights: {
    keyFiles: string[];
    importantFeatures: string[];
    recommendations: string[];
  };
  stats: {
    totalFiles: number;
    totalDirectories: number;
    dependencies: number;
    testExamples: number;
  };
}