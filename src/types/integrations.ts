export interface IntegrationsState {
  githubActions: GitHubActionsConfig;
  allureReporter: AllureReporterConfig;
  cucumberIntegration: CucumberIntegrationConfig;
  fakerLibrary: FakerLibraryConfig;
}

export interface GitHubActionsConfig {
  enabled: boolean;
  workflowName: string;
  triggers: {
    push: boolean;
    pullRequest: boolean;
    schedule: boolean;
  };
  nodeVersions: string[];
  operatingSystems: string[];
}

export interface AllureReporterConfig {
  enabled: boolean;
  generateReport: boolean;
  publishToPages: boolean;
  retainReports: number;
  categories: boolean;
  history: boolean;
}

export interface CucumberIntegrationConfig {
  enabled: boolean;
  featuresPath: string;
  stepsPath: string;
  supportPath: string;
  generateExamples: boolean;
  enableReports: boolean;
}

export interface FakerLibraryConfig {
  enabled: boolean;
  locale: string;
  generateHelpers: boolean;
  includeTypes: {
    personal: boolean;
    address: boolean;
    commerce: boolean;
    company: boolean;
    internet: boolean;
    lorem: boolean;
    date: boolean;
  };
}

export const DEFAULT_INTEGRATIONS_STATE: IntegrationsState = {
  githubActions: {
    enabled: true,
    workflowName: 'playwright-tests',
    triggers: {
      push: true,
      pullRequest: true,
      schedule: false,
    },
    nodeVersions: ['18.x', '20.x'],
    operatingSystems: ['ubuntu-latest'],
  },
  allureReporter: {
    enabled: false,
    generateReport: true,
    publishToPages: false,
    retainReports: 10,
    categories: true,
    history: true,
  },
  cucumberIntegration: {
    enabled: false,
    featuresPath: 'features',
    stepsPath: 'steps',
    supportPath: 'support',
    generateExamples: true,
    enableReports: true,
  },
  fakerLibrary: {
    enabled: true,
    locale: 'en',
    generateHelpers: true,
    includeTypes: {
      personal: true,
      address: true,
      commerce: true,
      company: true,
      internet: true,
      lorem: true,
      date: true,
    },
  },
};