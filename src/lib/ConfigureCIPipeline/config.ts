import { WorkflowConfig, DEFAULT_WORKFLOW_CONFIG } from '@/types/ciPipeline';

/**
 * Creates a new workflow configuration with given overrides
 */
export const createWorkflowConfig = (overrides: Partial<WorkflowConfig> = {}): WorkflowConfig => {
  return {
    ...DEFAULT_WORKFLOW_CONFIG,
    ...overrides,
    environments: {
      ...DEFAULT_WORKFLOW_CONFIG.environments,
      ...overrides.environments,
      nodeVersions: overrides.environments?.nodeVersions || ['18.x', '20.x', '22.x', '23.x', '24.x'],
    },
    id: overrides.id || `workflow-${Date.now()}`,
  };
};

/**
 * Creates workflow configurations from templates
 */
export const createWorkflowFromTemplate = (templateId: string): WorkflowConfig => {
  const baseConfig = createWorkflowConfig();

  switch (templateId) {
    case 'basic':
      return {
        ...baseConfig,
        name: 'Basic Playwright Tests',
        description: 'Simple CI workflow for running Playwright tests',
        triggers: {
          ...baseConfig.triggers,
          schedule: { ...baseConfig.triggers.schedule, enabled: false },
          manual: { ...baseConfig.triggers.manual, enabled: false },
          release: { ...baseConfig.triggers.release, enabled: false },
        },
        executionStrategy: {
          ...baseConfig.executionStrategy,
          mode: 'parallel',
          parallelism: 2,
          timeout: 15,
        },
        environments: {
          ...baseConfig.environments,
          nodeVersions: ['20.x', '22.x', '23.x', '24.x'],
          operatingSystems: ['ubuntu-latest'],
          browsers: ['chromium'],
        },
      };

    case 'cross-browser':
      return {
        ...baseConfig,
        name: 'Cross-Browser Tests',
        description: 'Test across multiple browsers and operating systems',
        executionStrategy: {
          ...baseConfig.executionStrategy,
          mode: 'matrix',
          timeout: 25,
        },
        environments: {
          ...baseConfig.environments,
          nodeVersions: ['18.x', '20.x', '22.x', '23.x', '24.x'],
          operatingSystems: ['ubuntu-latest', 'windows-latest', 'macos-latest'],
          browsers: ['chromium', 'firefox', 'webkit'],
        },
      };

    case 'advanced-ci':
      return {
        ...baseConfig,
        name: 'Advanced CI Pipeline',
        description: 'Full-featured CI pipeline with comprehensive testing and reporting',
        triggers: {
          ...baseConfig.triggers,
          schedule: { ...baseConfig.triggers.schedule, enabled: true },
        },
        executionStrategy: {
          ...baseConfig.executionStrategy,
          mode: 'sharded',
          shards: 4,
          timeout: 30,
        },
        retryStrategy: {
          ...baseConfig.retryStrategy,
          maxAttempts: 3,
          retryOn: ['failure', 'timeout', 'infrastructure-failure'],
          backoffStrategy: 'exponential',
        },
        reporting: {
          ...baseConfig.reporting,
          allure: {
            ...baseConfig.reporting.allure,
            enabled: true,
            publishToPages: true,
          },
          coverage: {
            ...baseConfig.reporting.coverage,
            enabled: true,
            threshold: 80,
          },
        },
        notifications: {
          ...baseConfig.notifications,
          slack: {
            ...baseConfig.notifications.slack,
            enabled: true,
          },
        },
        security: {
          ...baseConfig.security,
          secretScanning: true,
          dependencyCheck: true,
          codeAnalysis: true,
        },
      };

    case 'release-pipeline':
      return {
        ...baseConfig,
        name: 'Release Testing Pipeline',
        description: 'Comprehensive testing workflow for releases',
        triggers: {
          ...baseConfig.triggers,
          push: { ...baseConfig.triggers.push, enabled: false },
          pullRequest: { ...baseConfig.triggers.pullRequest, enabled: false },
          release: {
            ...baseConfig.triggers.release,
            enabled: true,
            types: ['published', 'prereleased'],
          },
          manual: {
            ...baseConfig.triggers.manual,
            enabled: true,
            inputs: [
              {
                name: 'release_version',
                description: 'Version to test',
                type: 'string',
                required: true,
                default: '',
              },
              {
                name: 'environment',
                description: 'Environment to test against',
                type: 'choice',
                required: true,
                default: 'production',
                options: ['staging', 'production'],
              },
            ],
          },
        },
        executionStrategy: {
          ...baseConfig.executionStrategy,
          mode: 'matrix',
          timeout: 45,
          failFast: false,
        },
        environments: {
          ...baseConfig.environments,
          nodeVersions: ['18.x', '20.x', '22.x', '23.x', '24.x'],
          operatingSystems: ['ubuntu-latest', 'windows-latest', 'macos-latest'],
        },
        reporting: {
          ...baseConfig.reporting,
          htmlReport: {
            ...baseConfig.reporting.htmlReport,
            publishToPages: true,
            retention: 90,
          },
          allure: {
            ...baseConfig.reporting.allure,
            enabled: true,
            publishToPages: true,
            retention: 90,
          },
        },
        artifacts: {
          ...baseConfig.artifacts,
          screenshots: {
            ...baseConfig.artifacts.screenshots,
            onFailureOnly: false,
            retention: 90,
          },
          videos: {
            ...baseConfig.artifacts.videos,
            onFailureOnly: false,
            retention: 30,
          },
          traces: {
            ...baseConfig.artifacts.traces,
            onFailureOnly: false,
            retention: 30,
          },
        },
      };

    case 'performance-testing':
      return {
        ...baseConfig,
        name: 'Performance Testing Pipeline',
        description: 'Specialized workflow for performance and load testing',
        triggers: {
          ...baseConfig.triggers,
          push: { ...baseConfig.triggers.push, enabled: false },
          pullRequest: { ...baseConfig.triggers.pullRequest, enabled: false },
          schedule: {
            ...baseConfig.triggers.schedule,
            enabled: true,
            cron: '0 2 * * *',
          },
          manual: {
            ...baseConfig.triggers.manual,
            enabled: true,
            inputs: [
              {
                name: 'test_duration',
                description: 'Test duration in minutes',
                type: 'choice',
                required: true,
                default: '10',
                options: ['5', '10', '30', '60'],
              },
              {
                name: 'concurrent_users',
                description: 'Number of concurrent users',
                type: 'choice',
                required: true,
                default: '10',
                options: ['1', '5', '10', '25', '50'],
              },
            ],
          },
        },
        executionStrategy: {
          ...baseConfig.executionStrategy,
          mode: 'sequential',
          timeout: 90,
          failFast: false,
        },
        environments: {
          ...baseConfig.environments,
          nodeVersions: ['20.x', '22.x', '23.x', '24.x'],
          operatingSystems: ['ubuntu-latest'],
          browsers: ['chromium'],
        },
        reporting: {
          ...baseConfig.reporting,
          customReports: [
            {
              name: 'Performance Metrics',
              command: 'npm run generate-perf-report',
              outputPath: 'performance-report.html',
              format: 'html',
            },
          ],
        },
        artifacts: {
          ...baseConfig.artifacts,
          customArtifacts: [
            {
              name: 'performance-metrics',
              path: 'performance-results/**/*',
              retention: 30,
              condition: 'always',
            },
          ],
        },
      };

    case 'accessibility-testing':
      return {
        ...baseConfig,
        name: 'Accessibility Testing',
        description: 'Focused on accessibility compliance and testing',
        triggers: {
          ...baseConfig.triggers,
          schedule: { ...baseConfig.triggers.schedule, enabled: false },
          manual: { ...baseConfig.triggers.manual, enabled: false },
          release: { ...baseConfig.triggers.release, enabled: false },
        },
        executionStrategy: {
          ...baseConfig.executionStrategy,
          mode: 'parallel',
          parallelism: 2,
          timeout: 20,
        },
        environments: {
          ...baseConfig.environments,
          nodeVersions: ['20.x', '22.x', '23.x', '24.x'],
          operatingSystems: ['ubuntu-latest'],
          browsers: ['chromium', 'firefox'],
        },
        reporting: {
          ...baseConfig.reporting,
          customReports: [
            {
              name: 'Accessibility Report',
              command: 'npm run generate-a11y-report',
              outputPath: 'accessibility-report.html',
              format: 'html',
            },
          ],
        },
        artifacts: {
          ...baseConfig.artifacts,
          customArtifacts: [
            {
              name: 'accessibility-results',
              path: 'accessibility-results/**/*',
              retention: 30,
              condition: 'always',
            },
          ],
        },
      };

    default:
      return baseConfig;
  }
};

/**
 * Gets recommended settings based on project characteristics
 */
export const getRecommendedSettings = (projectType: 'small' | 'medium' | 'large' | 'enterprise') => {
  switch (projectType) {
    case 'small':
      return {
        executionStrategy: { mode: 'parallel' as const, parallelism: 2, timeout: 15 },
        environments: {
          nodeVersions: ['20.x', '22.x', '23.x', '24.x'],
          operatingSystems: ['ubuntu-latest'],
          browsers: ['chromium'],
        },
        retryStrategy: { enabled: true, maxAttempts: 2 },
      };

    case 'medium':
      return {
        executionStrategy: { mode: 'sharded' as const, shards: 4, timeout: 25 },
        environments: {
          nodeVersions: ['18.x', '20.x', '22.x', '23.x', '24.x'],
          operatingSystems: ['ubuntu-latest', 'windows-latest'],
          browsers: ['chromium', 'firefox'],
        },
        retryStrategy: { enabled: true, maxAttempts: 3 },
      };

    case 'large':
      return {
        executionStrategy: { mode: 'matrix' as const, timeout: 35 },
        environments: {
          nodeVersions: ['18.x', '20.x', '22.x', '23.x', '24.x'],
          operatingSystems: ['ubuntu-latest', 'windows-latest', 'macos-latest'],
          browsers: ['chromium', 'firefox', 'webkit'],
        },
        retryStrategy: { enabled: true, maxAttempts: 3, backoffStrategy: 'exponential' as const },
      };

    case 'enterprise':
      return {
        executionStrategy: { mode: 'sharded' as const, shards: 8, timeout: 45 },
        environments: {
          nodeVersions: ['18.x', '20.x', '22.x', '23.x', '24.x'],
          operatingSystems: ['ubuntu-latest', 'windows-latest', 'macos-latest'],
          browsers: ['chromium', 'firefox', 'webkit'],
        },
        retryStrategy: { 
          enabled: true, 
          maxAttempts: 3, 
          backoffStrategy: 'exponential' as const,
          retryOn: ['failure', 'timeout', 'infrastructure-failure'] as const,
        },
        security: {
          secretScanning: true,
          dependencyCheck: true,
          codeAnalysis: true,
        },
      };

    default:
      return {};
  }
};

/**
 * Optimizes workflow configuration for better performance
 */
export const optimizeWorkflow = (workflow: WorkflowConfig): WorkflowConfig => {
  const optimized = { ...workflow };

  // Optimize execution strategy based on environment matrix
  const totalJobs = workflow.environments.nodeVersions.length * 
                   workflow.environments.operatingSystems.length * 
                   workflow.environments.browsers.length;

  if (totalJobs > 10 && workflow.executionStrategy.mode === 'sequential') {
    optimized.executionStrategy.mode = 'parallel';
    optimized.executionStrategy.parallelism = Math.min(totalJobs, 4);
  }

  // Optimize artifact retention based on workflow frequency
  const hasFrequentTriggers = workflow.triggers.push.enabled && workflow.triggers.pullRequest.enabled;
  if (hasFrequentTriggers) {
    optimized.artifacts.screenshots.retention = Math.min(optimized.artifacts.screenshots.retention, 14);
    optimized.artifacts.videos.retention = Math.min(optimized.artifacts.videos.retention, 7);
    optimized.artifacts.traces.retention = Math.min(optimized.artifacts.traces.retention, 7);
  }

  // Optimize timeout based on execution mode
  if (workflow.executionStrategy.mode === 'parallel' && workflow.executionStrategy.timeout > 30) {
    optimized.executionStrategy.timeout = 30;
  }

  return optimized;
};