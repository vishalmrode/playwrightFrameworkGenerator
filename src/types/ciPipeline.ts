export interface CIPipelineState {
  enabled: boolean;
  workflows: WorkflowConfig[];
  selectedWorkflowIndex: number;
  globalSettings: GlobalCISettings;
}

export interface WorkflowConfig {
  id: string;
  name: string;
  description?: string;
  triggers: TriggerConfig;
  executionStrategy: ExecutionStrategy;
  retryStrategy: RetryStrategy;
  environments: EnvironmentMatrix;
  reporting: ReportingConfig;
  artifacts: ArtifactConfig;
  notifications: NotificationConfig;
  security: SecurityConfig;
}

export interface TriggerConfig {
  push: {
    enabled: boolean;
    branches: string[];
    paths?: string[];
    ignore?: string[];
  };
  pullRequest: {
    enabled: boolean;
    branches: string[];
    types: PullRequestType[];
  };
  schedule: {
    enabled: boolean;
    cron: string;
    timezone?: string;
  };
  manual: {
    enabled: boolean;
    inputs?: WorkflowInput[];
  };
  release: {
    enabled: boolean;
    types: ReleaseType[];
  };
}

export interface ExecutionStrategy {
  mode: 'parallel' | 'sequential' | 'sharded' | 'matrix';
  parallelism?: number;
  shards?: number;
  timeout: number;
  failFast: boolean;
  continueOnError: boolean;
}

export interface RetryStrategy {
  enabled: boolean;
  maxAttempts: number;
  retryOn: RetryCondition[];
  backoffStrategy: 'linear' | 'exponential' | 'fixed';
  delaySeconds: number;
}

export interface EnvironmentMatrix {
  nodeVersions: string[];
  operatingSystems: string[];
  browsers: string[];
  customVariables?: { [key: string]: string[] };
}

export interface ReportingConfig {
  htmlReport: {
    enabled: boolean;
    publishToPages: boolean;
    retention: number;
  };
  junit: {
    enabled: boolean;
    outputPath: string;
  };
  coverage: {
    enabled: boolean;
    threshold: number;
    formats: CoverageFormat[];
  };
  allure: {
    enabled: boolean;
    publishToPages: boolean;
    retention: number;
  };
  customReports: CustomReport[];
}

export interface ArtifactConfig {
  screenshots: {
    enabled: boolean;
    onFailureOnly: boolean;
    retention: number;
  };
  videos: {
    enabled: boolean;
    onFailureOnly: boolean;
    retention: number;
  };
  traces: {
    enabled: boolean;
    onFailureOnly: boolean;
    retention: number;
  };
  logs: {
    enabled: boolean;
    retention: number;
  };
  testResults: {
    enabled: boolean;
    retention: number;
  };
  customArtifacts: CustomArtifact[];
}

export interface NotificationConfig {
  slack: {
    enabled: boolean;
    webhook?: string;
    channels: string[];
    onSuccess: boolean;
    onFailure: boolean;
  };
  teams: {
    enabled: boolean;
    webhook?: string;
    onSuccess: boolean;
    onFailure: boolean;
  };
  email: {
    enabled: boolean;
    recipients: string[];
    onSuccess: boolean;
    onFailure: boolean;
  };
  github: {
    enabled: boolean;
    checkRuns: boolean;
    pullRequestComments: boolean;
    statusChecks: boolean;
  };
}

export interface SecurityConfig {
  secretScanning: boolean;
  dependencyCheck: boolean;
  codeAnalysis: boolean;
  permissions: {
    contents: 'read' | 'write';
    actions: 'read' | 'write';
    checks: 'read' | 'write';
    deployments: 'read' | 'write';
    issues: 'read' | 'write';
    packages: 'read' | 'write';
    pullRequests: 'read' | 'write';
    security: 'read' | 'write';
  };
}

export interface GlobalCISettings {
  defaultTimeout: number;
  concurrencyGroup: string;
  cancelInProgress: boolean;
  workflowPermissions: 'restricted' | 'permissive';
  enableDebugLogging: boolean;
}

export interface WorkflowInput {
  name: string;
  description: string;
  type: 'boolean' | 'choice' | 'environment' | 'string';
  required: boolean;
  default?: string;
  options?: string[];
}

export interface CustomReport {
  name: string;
  command: string;
  outputPath: string;
  format: string;
}

export interface CustomArtifact {
  name: string;
  path: string;
  retention: number;
  condition?: 'always' | 'on-success' | 'on-failure';
}

export type PullRequestType = 'opened' | 'synchronize' | 'reopened' | 'closed' | 'ready_for_review';
export type ReleaseType = 'published' | 'unpublished' | 'created' | 'edited' | 'deleted' | 'prereleased' | 'released';
export type RetryCondition = 'failure' | 'timeout' | 'cancelled' | 'network-error' | 'infrastructure-failure';
export type CoverageFormat = 'lcov' | 'cobertura' | 'clover' | 'json' | 'text';

export const DEFAULT_WORKFLOW_CONFIG: WorkflowConfig = {
  id: 'main-workflow',
  name: 'Playwright Tests',
  description: 'Main CI pipeline for running Playwright tests',
  triggers: {
    push: {
      enabled: true,
      branches: ['main', 'master'],
      paths: [],
      ignore: ['*.md', 'docs/**'],
    },
    pullRequest: {
      enabled: true,
      branches: ['main', 'master'],
      types: ['opened', 'synchronize', 'reopened'],
    },
    schedule: {
      enabled: false,
      cron: '0 2 * * *',
      timezone: 'UTC',
    },
    manual: {
      enabled: true,
      inputs: [
        {
          name: 'environment',
          description: 'Environment to test against',
          type: 'choice',
          required: true,
          default: 'staging',
          options: ['staging', 'production', 'development'],
        },
      ],
    },
    release: {
      enabled: false,
      types: ['published'],
    },
  },
  executionStrategy: {
    mode: 'parallel',
    parallelism: 4,
    timeout: 30,
    failFast: false,
    continueOnError: false,
  },
  retryStrategy: {
    enabled: true,
    maxAttempts: 2,
    retryOn: ['failure', 'timeout'],
    backoffStrategy: 'linear',
    delaySeconds: 30,
  },
  environments: {
    nodeVersions: ['18.x', '20.x'],
    operatingSystems: ['ubuntu-latest'],
    browsers: ['chromium', 'firefox', 'webkit'],
  },
  reporting: {
    htmlReport: {
      enabled: true,
      publishToPages: true,
      retention: 30,
    },
    junit: {
      enabled: true,
      outputPath: 'test-results/junit.xml',
    },
    coverage: {
      enabled: false,
      threshold: 80,
      formats: ['lcov', 'text'],
    },
    allure: {
      enabled: false,
      publishToPages: false,
      retention: 30,
    },
    customReports: [],
  },
  artifacts: {
    screenshots: {
      enabled: true,
      onFailureOnly: true,
      retention: 30,
    },
    videos: {
      enabled: true,
      onFailureOnly: true,
      retention: 7,
    },
    traces: {
      enabled: true,
      onFailureOnly: true,
      retention: 7,
    },
    logs: {
      enabled: true,
      retention: 30,
    },
    testResults: {
      enabled: true,
      retention: 90,
    },
    customArtifacts: [],
  },
  notifications: {
    slack: {
      enabled: false,
      channels: ['#ci-notifications'],
      onSuccess: false,
      onFailure: true,
    },
    teams: {
      enabled: false,
      onSuccess: false,
      onFailure: true,
    },
    email: {
      enabled: false,
      recipients: [],
      onSuccess: false,
      onFailure: true,
    },
    github: {
      enabled: true,
      checkRuns: true,
      pullRequestComments: true,
      statusChecks: true,
    },
  },
  security: {
    secretScanning: true,
    dependencyCheck: true,
    codeAnalysis: false,
    permissions: {
      contents: 'read',
      actions: 'read',
      checks: 'write',
      deployments: 'read',
      issues: 'read',
      packages: 'read',
      pullRequests: 'write',
      security: 'read',
    },
  },
};

export const DEFAULT_CI_PIPELINE_STATE: CIPipelineState = {
  enabled: true,
  workflows: [DEFAULT_WORKFLOW_CONFIG],
  selectedWorkflowIndex: 0,
  globalSettings: {
    defaultTimeout: 30,
    concurrencyGroup: 'ci-${{ github.ref }}',
    cancelInProgress: true,
    workflowPermissions: 'restricted',
    enableDebugLogging: false,
  },
};

export const NODE_VERSIONS = [
  { value: '16.x', label: 'Node.js 16' },
  { value: '18.x', label: 'Node.js 18 (LTS)' },
  { value: '20.x', label: 'Node.js 20 (Current)' },
  { value: '21.x', label: 'Node.js 21 (Latest)' },
] as const;

export const OPERATING_SYSTEMS = [
  { value: 'ubuntu-latest', label: 'Ubuntu Latest' },
  { value: 'ubuntu-22.04', label: 'Ubuntu 22.04' },
  { value: 'ubuntu-20.04', label: 'Ubuntu 20.04' },
  { value: 'windows-latest', label: 'Windows Latest' },
  { value: 'windows-2022', label: 'Windows Server 2022' },
  { value: 'windows-2019', label: 'Windows Server 2019' },
  { value: 'macos-latest', label: 'macOS Latest' },
  { value: 'macos-13', label: 'macOS 13' },
  { value: 'macos-12', label: 'macOS 12' },
] as const;

export const BROWSERS = [
  { value: 'chromium', label: 'Chromium' },
  { value: 'firefox', label: 'Firefox' },
  { value: 'webkit', label: 'WebKit (Safari)' },
] as const;