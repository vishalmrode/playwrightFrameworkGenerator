/**
 * ConfigureCIPipeline/index.ts
 * Purpose: Utilities to validate CI pipeline configuration and to generate
 * descriptive text and workflow file lists. These functions are pure helpers
 * used by the CI UI and the generator.
 */
import type {
  CIPipelineState, 
  WorkflowConfig, 
  TriggerConfig, 
  ExecutionStrategy,
  EnvironmentMatrix,
  ArtifactConfig,
} from '@/types/ciPipeline';

/**
 * Validates CI pipeline configuration
 */
export const validateCIPipelineConfig = (config: CIPipelineState): boolean => {
  if (!config.enabled) return true;
  
  return (
    config.workflows.length > 0 &&
    config.workflows.every(workflow => validateWorkflowConfig(workflow)) &&
    validateGlobalSettings(config.globalSettings)
  );
};

/**
 * Validates a workflow configuration
 */
export const validateWorkflowConfig = (workflow: WorkflowConfig): boolean => {
  return (
    workflow.name.length > 0 &&
    workflow.id.length > 0 &&
    validateTriggerConfig(workflow.triggers) &&
    validateExecutionStrategy(workflow.executionStrategy) &&
    validateEnvironmentMatrix(workflow.environments) &&
    workflow.executionStrategy.timeout > 0 &&
    workflow.retryStrategy.maxAttempts >= 0
  );
};

/**
 * Validates trigger configuration
 */
export const validateTriggerConfig = (triggers: TriggerConfig): boolean => {
  const hasAnyTrigger = 
    triggers.push.enabled ||
    triggers.pullRequest.enabled ||
    triggers.schedule.enabled ||
    triggers.manual.enabled ||
    triggers.release.enabled;

  if (!hasAnyTrigger) return false;

  if (triggers.push.enabled && triggers.push.branches.length === 0) return false;
  if (triggers.pullRequest.enabled && triggers.pullRequest.branches.length === 0) return false;
  if (triggers.schedule.enabled && !isValidCron(triggers.schedule.cron)) return false;

  return true;
};

/**
 * Validates execution strategy
 */
export const validateExecutionStrategy = (strategy: ExecutionStrategy): boolean => {
  if (strategy.mode === 'parallel' && strategy.parallelism && strategy.parallelism < 1) return false;
  if (strategy.mode === 'sharded' && strategy.shards && strategy.shards < 1) return false;
  return strategy.timeout > 0;
};

/**
 * Validates environment matrix
 */
export const validateEnvironmentMatrix = (matrix: EnvironmentMatrix): boolean => {
  return (
    matrix.nodeVersions.length > 0 &&
    matrix.operatingSystems.length > 0 &&
    matrix.browsers.length > 0
  );
};

/**
 * Validates global settings
 */
export const validateGlobalSettings = (settings: any): boolean => {
  return (
    settings.defaultTimeout > 0 &&
    settings.concurrencyGroup.length > 0
  );
};

/**
 * Validates cron expression (basic validation)
 */
export const isValidCron = (cron: string): boolean => {
  const cronParts = cron.trim().split(/\s+/);
  return cronParts.length >= 5 && cronParts.length <= 6;
};

/**
 * Gets a description of the CI pipeline configuration
 */
export const getCIPipelineDescription = (config: CIPipelineState): string => {
  if (!config.enabled) return 'CI pipeline disabled';
  
  const workflowCount = config.workflows.length;
  const selectedWorkflow = config.workflows[config.selectedWorkflowIndex];
  
  if (!selectedWorkflow) return 'No workflows configured';

  const triggers = getEnabledTriggers(selectedWorkflow.triggers);
  const triggerText = triggers.length > 0 ? triggers.join(', ') : 'no triggers';
  
  return `${workflowCount} workflow${workflowCount === 1 ? '' : 's'} with ${triggerText}`;
};

/**
 * Gets enabled triggers from trigger configuration
 */
export const getEnabledTriggers = (triggers: TriggerConfig): string[] => {
  const enabled = [];
  
  if (triggers.push.enabled) enabled.push('push');
  if (triggers.pullRequest.enabled) enabled.push('PR');
  if (triggers.schedule.enabled) enabled.push('schedule');
  if (triggers.manual.enabled) enabled.push('manual');
  if (triggers.release.enabled) enabled.push('release');
  
  return enabled;
};

/**
 * Gets workflow files that will be generated
 */
export const getGeneratedWorkflowFiles = (config: CIPipelineState): string[] => {
  if (!config.enabled) return [];
  
  return config.workflows.map(workflow => 
    `.github/workflows/${workflow.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.yml`
  );
};

// ensure some exported helpers are referenced to avoid TS6133 in test-only builds
void getGeneratedWorkflowFiles;

/**
 * Gets the total number of jobs that will run in a workflow
 */
export const getWorkflowJobCount = (workflow: WorkflowConfig): number => {
  const { nodeVersions, operatingSystems, browsers } = workflow.environments;
  
  if (workflow.executionStrategy.mode === 'matrix') {
    return nodeVersions.length * operatingSystems.length * browsers.length;
  }
  
  return 1;
};

/**
 * Gets estimated workflow duration in minutes
 */
export const getEstimatedDuration = (workflow: WorkflowConfig): number => {
  const baseTime = workflow.executionStrategy.timeout;
  const jobCount = getWorkflowJobCount(workflow);
  
  if (workflow.executionStrategy.mode === 'parallel') {
    return Math.ceil(baseTime * Math.ceil(jobCount / (workflow.executionStrategy.parallelism || 1)));
  }
  
  if (workflow.executionStrategy.mode === 'sequential') {
    return baseTime * jobCount;
  }
  
  return baseTime;
};

/**
 * Gets workflow complexity score (1-10)
 */
export const getWorkflowComplexity = (workflow: WorkflowConfig): number => {
  let score = 1;
  
  // Add points for triggers
  score += getEnabledTriggers(workflow.triggers).length * 0.5;
  
  // Add points for matrix size
  const jobCount = getWorkflowJobCount(workflow);
  if (jobCount > 10) score += 3;
  else if (jobCount > 5) score += 2;
  else if (jobCount > 1) score += 1;
  
  // Add points for features
  if (workflow.retryStrategy.enabled) score += 0.5;
  if (workflow.reporting.allure.enabled) score += 0.5;
  if (workflow.notifications.slack.enabled || workflow.notifications.teams.enabled) score += 0.5;
  if (workflow.security.secretScanning || workflow.security.dependencyCheck) score += 0.5;
  
  return Math.min(Math.ceil(score), 10);
};

/**
 * Gets recommendations for improving workflow configuration
 */
export const getWorkflowRecommendations = (workflow: WorkflowConfig): string[] => {
  const recommendations = [];
  
  // Check for common issues
  if (!workflow.retryStrategy.enabled) {
    recommendations.push('Enable retry strategy to handle flaky tests');
  }
  
  if (!workflow.artifacts.screenshots.enabled && !workflow.artifacts.videos.enabled) {
    recommendations.push('Enable screenshot/video capture for debugging failures');
  }
  
  if (workflow.executionStrategy.mode === 'sequential' && getWorkflowJobCount(workflow) > 3) {
    recommendations.push('Consider using parallel execution to reduce build time');
  }
  
  if (!workflow.triggers.pullRequest.enabled) {
    recommendations.push('Enable PR triggers to catch issues before merging');
  }
  
  if (workflow.executionStrategy.timeout > 60) {
    recommendations.push('Consider reducing timeout or optimizing tests for better performance');
  }
  
  if (!workflow.reporting.htmlReport.enabled) {
    recommendations.push('Enable HTML reports for better test result visibility');
  }

  if (workflow.environments.operatingSystems.length === 1 && workflow.environments.operatingSystems[0] === 'ubuntu-latest') {
    recommendations.push('Consider testing on multiple operating systems for broader compatibility');
  }
  
  return recommendations;
};

/**
 * Gets the cost estimation for running the workflow (in GitHub Actions minutes)
 */
export const getWorkflowCostEstimation = (workflow: WorkflowConfig): {
  linuxMinutes: number;
  windowsMinutes: number;
  macosMinutes: number;
  totalCost: number; // in USD approximate
} => {
  const duration = getEstimatedDuration(workflow);
  const { operatingSystems } = workflow.environments;
  
  let linuxMinutes = 0;
  let windowsMinutes = 0;
  let macosMinutes = 0;
  
  operatingSystems.forEach(os => {
    if (os.includes('ubuntu')) {
      linuxMinutes += duration;
    } else if (os.includes('windows')) {
      windowsMinutes += duration;
    } else if (os.includes('macos')) {
      macosMinutes += duration;
    }
  });
  
  // GitHub Actions pricing (approximate)
  const linuxCostPerMinute = 0.008;
  const windowsCostPerMinute = 0.016;
  const macosCostPerMinute = 0.08;
  
  const totalCost = 
    linuxMinutes * linuxCostPerMinute +
    windowsMinutes * windowsCostPerMinute +
    macosMinutes * macosCostPerMinute;
  
  return {
    linuxMinutes,
    windowsMinutes,
    macosMinutes,
    totalCost: Math.round(totalCost * 100) / 100,
  };
};

/**
 * Generates workflow YAML configuration
 */
export const generateWorkflowYAML = (workflow: WorkflowConfig): string => {
  // This would generate the actual GitHub Actions YAML
  // For now, return a placeholder that shows the structure
  return `# ${workflow.name}
# This workflow will be generated based on your configuration
name: ${workflow.name}

on:
  ${generateTriggerSection(workflow.triggers)}

jobs:
  test:
    runs-on: \${{ matrix.os }}
    strategy:
      matrix:
        node-version: [${workflow.environments.nodeVersions.map(v => `'${v}'`).join(', ')}]
        os: [${workflow.environments.operatingSystems.map(os => `'${os}'`).join(', ')}]
        browser: [${workflow.environments.browsers.map(b => `'${b}'`).join(', ')}]
    
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node-version }}
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install
      - name: Run tests
        run: npx playwright test --project=\${{ matrix.browser }}
      ${generateArtifactSection(workflow.artifacts)}`;
};

const generateTriggerSection = (triggers: TriggerConfig): string => {
  const sections = [];
  
  if (triggers.push.enabled) {
    sections.push(`push:
    branches: [${triggers.push.branches.map(b => `'${b}'`).join(', ')}]`);
  }
  
  if (triggers.pullRequest.enabled) {
    sections.push(`pull_request:
    branches: [${triggers.pullRequest.branches.map(b => `'${b}'`).join(', ')}]`);
  }
  
  if (triggers.schedule.enabled) {
    sections.push(`schedule:
    - cron: '${triggers.schedule.cron}'`);
  }
  
  return sections.join('\n  ');
};

const generateArtifactSection = (artifacts: ArtifactConfig): string => {
  const sections = [];
  
  if (artifacts.screenshots.enabled || artifacts.videos.enabled || artifacts.traces.enabled) {
    sections.push(`- name: Upload test artifacts
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: test-artifacts
          path: |
            test-results/
            playwright-report/`);
  }
  
  return sections.join('\n      ');
};