import { ProgrammingLanguage } from "./language";
import { FixturesConfiguration } from "./fixtures";

export interface UiState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

export interface BrowserState {
  selectedBrowsers: {
    chromium: boolean;
    firefox: boolean;
    webkit: boolean;
  };
}

export interface DockerState {
  enabled: boolean;
  baseImage: string;
  customCommands: string[];
}

export interface IntegrationsState {
  allureReporter: { enabled: boolean };
  githubActions: { enabled: boolean };
  cucumberIntegration: { enabled: boolean };
  fakerLibrary: { enabled: boolean };
}

export interface EnvironmentState {
  baseUrl: string;
  apiUrl: string;
  environments: {
    dev: boolean;
    staging: boolean;
    prod: boolean;
  };
}

export interface TestingCapabilities {
  uiTesting: boolean;
  apiTesting: boolean;
  visualTesting: boolean;
  accessibilityTesting: boolean;
  performanceTesting: boolean;
  crossBrowserTesting: boolean;
}

export interface CIPipelineState {
  enabled: boolean;
  trigger: {
    push: boolean;
    pullRequest: boolean;
    schedule: boolean;
  };
  notifications: {
    email: boolean;
    slack: boolean;
  };
}

export interface FixturesState extends FixturesConfiguration {}

export interface CodeQualityState {
  lint: boolean;
  prettier: boolean;
  husky: boolean;
}

export interface LanguageState {
  selectedLanguage: ProgrammingLanguage;
}

export interface RootState {
  ui: UiState;
  language: LanguageState;
  browser: BrowserState;
  testingCapabilities: TestingCapabilities;
  environment: EnvironmentState;
  integrations: IntegrationsState;
  fixtures: FixturesState;
  docker: DockerState;
  codeQuality: CodeQualityState;
  ciPipeline: CIPipelineState;
}
