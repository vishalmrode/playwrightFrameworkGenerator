import { IntegrationOption, ConfigurationGroup } from './types';

export const INTEGRATION_OPTIONS: IntegrationOption[] = [
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    description: 'CI/CD workflow automation for GitHub repositories',
    icon: 'GitBranch',
    category: 'ci-cd',
    popular: true,
  },
  {
    id: 'allure-reporter',
    name: 'Allure Reporter',
    description: 'Rich test reporting with detailed analytics and history',
    icon: 'FileText',
    category: 'reporting',
  },
  {
    id: 'cucumber-integration',
    name: 'Cucumber Integration',
    description: 'Behavior-driven development with Gherkin syntax',
    icon: 'Zap',
    category: 'testing',
  },
  {
    id: 'faker-library',
    name: 'Faker Library',
    description: 'Generate realistic test data for comprehensive testing',
    icon: 'Users',
    category: 'data',
    popular: true,
  },
];

export const GITHUB_ACTIONS_CONFIG: ConfigurationGroup[] = [
  {
    title: 'Workflow Settings',
    description: 'Configure your GitHub Actions workflow',
    options: [
      {
        key: 'workflowName',
        label: 'Workflow Name',
        description: 'Name for the workflow file',
        type: 'string',
        defaultValue: 'playwright-tests',
        validation: (value: string) => value.length > 0 || 'Workflow name is required',
      },
    ],
  },
  {
    title: 'Triggers',
    description: 'When should the workflow run',
    options: [
      {
        key: 'triggers.push',
        label: 'On Push',
        description: 'Run tests when code is pushed',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'triggers.pullRequest',
        label: 'On Pull Request',
        description: 'Run tests on pull requests',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'triggers.schedule',
        label: 'Scheduled',
        description: 'Run tests on a schedule',
        type: 'boolean',
        defaultValue: false,
      },
    ],
  },
  {
    title: 'Environment Matrix',
    description: 'Test environments to run against',
    options: [
      {
        key: 'nodeVersions',
        label: 'Node.js Versions',
        type: 'array',
        defaultValue: ['18.x', '20.x'],
      },
      {
        key: 'operatingSystems',
        label: 'Operating Systems',
        type: 'array',
        defaultValue: ['ubuntu-latest'],
      },
    ],
  },
];

export const ALLURE_REPORTER_CONFIG: ConfigurationGroup[] = [
  {
    title: 'Report Generation',
    description: 'Configure Allure report generation',
    options: [
      {
        key: 'generateReport',
        label: 'Generate HTML Report',
        description: 'Create HTML report after test execution',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'publishToPages',
        label: 'Publish to GitHub Pages',
        description: 'Automatically publish reports to GitHub Pages',
        type: 'boolean',
        defaultValue: false,
      },
    ],
  },
  {
    title: 'Report Features',
    description: 'Additional report features',
    options: [
      {
        key: 'categories',
        label: 'Test Categories',
        description: 'Categorize test results',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'history',
        label: 'Test History',
        description: 'Track test results over time',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'retainReports',
        label: 'Retain Reports',
        description: 'Number of historical reports to keep',
        type: 'number',
        defaultValue: 10,
        validation: (value: number) => value > 0 || 'Must retain at least 1 report',
      },
    ],
  },
];

export const CUCUMBER_INTEGRATION_CONFIG: ConfigurationGroup[] = [
  {
    title: 'Directory Structure',
    description: 'Configure Cucumber file locations',
    options: [
      {
        key: 'featuresPath',
        label: 'Features Directory',
        description: 'Location of feature files',
        type: 'string',
        defaultValue: 'features',
      },
      {
        key: 'stepsPath',
        label: 'Steps Directory',
        description: 'Location of step definitions',
        type: 'string',
        defaultValue: 'steps',
      },
      {
        key: 'supportPath',
        label: 'Support Directory',
        description: 'Location of support files',
        type: 'string',
        defaultValue: 'support',
      },
    ],
  },
  {
    title: 'Generation Options',
    description: 'What to generate with Cucumber',
    options: [
      {
        key: 'generateExamples',
        label: 'Generate Examples',
        description: 'Create example feature files and step definitions',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'enableReports',
        label: 'Enable Reports',
        description: 'Generate Cucumber HTML reports',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
];

export const FAKER_LIBRARY_CONFIG: ConfigurationGroup[] = [
  {
    title: 'Localization',
    description: 'Configure Faker locale and language',
    options: [
      {
        key: 'locale',
        label: 'Locale',
        description: 'Language/region for generated data',
        type: 'select',
        defaultValue: 'en',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
        ],
      },
    ],
  },
  {
    title: 'Helper Generation',
    description: 'Generate helper utilities',
    options: [
      {
        key: 'generateHelpers',
        label: 'Generate Helpers',
        description: 'Create utility functions for common data types',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
  {
    title: 'Data Types',
    description: 'Types of fake data to include',
    options: [
      {
        key: 'includeTypes.personal',
        label: 'Personal Data',
        description: 'Names, emails, phone numbers',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'includeTypes.address',
        label: 'Address Data',
        description: 'Addresses, cities, countries',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'includeTypes.commerce',
        label: 'Commerce Data',
        description: 'Products, prices, departments',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'includeTypes.company',
        label: 'Company Data',
        description: 'Company names, job titles',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'includeTypes.internet',
        label: 'Internet Data',
        description: 'URLs, domains, usernames',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'includeTypes.lorem',
        label: 'Lorem Text',
        description: 'Placeholder text and paragraphs',
        type: 'boolean',
        defaultValue: true,
      },
      {
        key: 'includeTypes.date',
        label: 'Date Data',
        description: 'Random dates and times',
        type: 'boolean',
        defaultValue: true,
      },
    ],
  },
];