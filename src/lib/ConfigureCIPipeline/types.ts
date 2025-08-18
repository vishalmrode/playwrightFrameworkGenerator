export interface TriggerOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface ExecutionMode {
  value: 'parallel' | 'sequential' | 'sharded' | 'matrix';
  label: string;
  description: string;
  icon: string;
  recommended?: boolean;
}

export interface RetryBackoffStrategy {
  value: 'linear' | 'exponential' | 'fixed';
  label: string;
  description: string;
}

export interface NotificationService {
  id: 'slack' | 'teams' | 'email' | 'github';
  name: string;
  description: string;
  icon: string;
  requiresCredentials: boolean;
}

export interface ArtifactType {
  id: string;
  name: string;
  description: string;
  icon: string;
  defaultRetention: number;
  onFailureOnly: boolean;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'advanced' | 'specialized';
  icon: string;
  triggers: string[];
  features: string[];
  complexity: number;
}

export const EXECUTION_MODES: ExecutionMode[] = [
  {
    value: 'parallel',
    label: 'Parallel Execution',
    description: 'Run tests in parallel to reduce execution time',
    icon: 'Zap',
    recommended: true,
  },
  {
    value: 'sequential',
    label: 'Sequential Execution',
    description: 'Run tests one after another in order',
    icon: 'ArrowRight',
  },
  {
    value: 'sharded',
    label: 'Sharded Execution',
    description: 'Split tests into shards for better parallelization',
    icon: 'Grid',
  },
  {
    value: 'matrix',
    label: 'Matrix Strategy',
    description: 'Run tests across multiple environment combinations',
    icon: 'Grid3x3',
  },
];

export const RETRY_STRATEGIES: RetryBackoffStrategy[] = [
  {
    value: 'linear',
    label: 'Linear Backoff',
    description: 'Wait a fixed amount of time between retries',
  },
  {
    value: 'exponential',
    label: 'Exponential Backoff',
    description: 'Increase wait time exponentially between retries',
  },
  {
    value: 'fixed',
    label: 'Fixed Delay',
    description: 'Wait the same amount of time between all retries',
  },
];

export const NOTIFICATION_SERVICES: NotificationService[] = [
  {
    id: 'slack',
    name: 'Slack',
    description: 'Send notifications to Slack channels',
    icon: 'MessageSquare',
    requiresCredentials: true,
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Send notifications to Teams channels',
    icon: 'Users',
    requiresCredentials: true,
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Send email notifications',
    icon: 'Mail',
    requiresCredentials: false,
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub check runs and PR comments',
    icon: 'Github',
    requiresCredentials: false,
  },
];

export const ARTIFACT_TYPES: ArtifactType[] = [
  {
    id: 'screenshots',
    name: 'Screenshots',
    description: 'Capture screenshots on test failures',
    icon: 'Camera',
    defaultRetention: 30,
    onFailureOnly: true,
  },
  {
    id: 'videos',
    name: 'Videos',
    description: 'Record videos of test execution',
    icon: 'Video',
    defaultRetention: 7,
    onFailureOnly: true,
  },
  {
    id: 'traces',
    name: 'Traces',
    description: 'Detailed execution traces for debugging',
    icon: 'Activity',
    defaultRetention: 7,
    onFailureOnly: true,
  },
  {
    id: 'logs',
    name: 'Logs',
    description: 'Test execution logs and console output',
    icon: 'FileText',
    defaultRetention: 30,
    onFailureOnly: false,
  },
  {
    id: 'testResults',
    name: 'Test Results',
    description: 'JUnit XML and JSON test results',
    icon: 'BarChart3',
    defaultRetention: 90,
    onFailureOnly: false,
  },
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'basic',
    name: 'Basic Testing',
    description: 'Simple workflow for basic test execution',
    category: 'basic',
    icon: 'Play',
    triggers: ['push', 'pull_request'],
    features: ['parallel execution', 'artifacts on failure'],
    complexity: 2,
  },
  {
    id: 'cross-browser',
    name: 'Cross-Browser Testing',
    description: 'Test across multiple browsers and operating systems',
    category: 'basic',
    icon: 'Globe',
    triggers: ['push', 'pull_request'],
    features: ['matrix strategy', 'multiple browsers', 'OS matrix'],
    complexity: 4,
  },
  {
    id: 'advanced-ci',
    name: 'Advanced CI/CD',
    description: 'Full-featured CI pipeline with reporting and notifications',
    category: 'advanced',
    icon: 'Cog',
    triggers: ['push', 'pull_request', 'schedule'],
    features: ['retry strategy', 'notifications', 'advanced reporting', 'security checks'],
    complexity: 7,
  },
  {
    id: 'release-pipeline',
    name: 'Release Pipeline',
    description: 'Comprehensive testing for release workflows',
    category: 'advanced',
    icon: 'Rocket',
    triggers: ['release', 'manual'],
    features: ['release triggers', 'deployment testing', 'comprehensive reporting'],
    complexity: 6,
  },
  {
    id: 'performance-testing',
    name: 'Performance Testing',
    description: 'Specialized workflow for performance and load testing',
    category: 'specialized',
    icon: 'Gauge',
    triggers: ['schedule', 'manual'],
    features: ['performance metrics', 'custom reporting', 'specialized artifacts'],
    complexity: 8,
  },
  {
    id: 'accessibility-testing',
    name: 'Accessibility Testing',
    description: 'Focus on accessibility compliance and testing',
    category: 'specialized',
    icon: 'Eye',
    triggers: ['push', 'pull_request'],
    features: ['accessibility checks', 'compliance reporting'],
    complexity: 5,
  },
];

export const CRON_PRESETS = [
  { value: '0 2 * * *', label: 'Daily at 2:00 AM' },
  { value: '0 0 * * 1', label: 'Weekly on Monday' },
  { value: '0 0 1 * *', label: 'Monthly on 1st' },
  { value: '0 */6 * * *', label: 'Every 6 hours' },
  { value: '0 9 * * 1-5', label: 'Weekdays at 9:00 AM' },
];

export const COMMON_BRANCHES = [
  'main',
  'master',
  'develop',
  'staging',
  'production',
  'release/*',
  'hotfix/*',
  'feature/*',
];

export const PULL_REQUEST_TYPES = [
  { value: 'opened', label: 'Opened' },
  { value: 'synchronize', label: 'Synchronized' },
  { value: 'reopened', label: 'Reopened' },
  { value: 'closed', label: 'Closed' },
  { value: 'ready_for_review', label: 'Ready for Review' },
];

export const RELEASE_TYPES = [
  { value: 'published', label: 'Published' },
  { value: 'unpublished', label: 'Unpublished' },
  { value: 'created', label: 'Created' },
  { value: 'edited', label: 'Edited' },
  { value: 'deleted', label: 'Deleted' },
  { value: 'prereleased', label: 'Pre-released' },
  { value: 'released', label: 'Released' },
];

export const RETRY_CONDITIONS = [
  { value: 'failure', label: 'Test Failures' },
  { value: 'timeout', label: 'Timeouts' },
  { value: 'cancelled', label: 'Cancelled Jobs' },
  { value: 'network-error', label: 'Network Errors' },
  { value: 'infrastructure-failure', label: 'Infrastructure Failures' },
];

export const COVERAGE_FORMATS = [
  { value: 'lcov', label: 'LCOV' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'clover', label: 'Clover' },
  { value: 'json', label: 'JSON' },
  { value: 'text', label: 'Text' },
];