export interface FixtureValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface GeneratedFixtureFile {
  path: string;
  content: string;
  description: string;
}

export interface FixtureGenerationResult {
  files: GeneratedFixtureFile[];
  dependencies: string[];
  imports: string[];
  configuration: Record<string, any>;
}

export interface FixtureDependency {
  packageName: string;
  version: string;
  devDependency: boolean;
  optional: boolean;
}

export interface FixtureConflict {
  fixtureId: string;
  conflictWith: string;
  reason: string;
  resolution: string;
}

export interface FixtureRecommendation {
  type: 'enable' | 'disable' | 'configure';
  fixtureId: string;
  reason: string;
  impact: 'low' | 'medium' | 'high';
}