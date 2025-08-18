import { ProjectFile, PreviewConfiguration } from '../types';

interface CIGenerationResult {
  files: ProjectFile[];
}

/**
 * Generates CI/CD configuration files
 */
export function generateCIFiles(config: PreviewConfiguration): CIGenerationResult {
  const files: ProjectFile[] = [];

  // GitHub Actions
  if (config.integrations.includes('github-actions')) {
    const githubWorkflow = generateGitHubActionsWorkflow(config);
    files.push(githubWorkflow);
  }

  // GitLab CI
  if (config.integrations.includes('gitlab-ci')) {
    const gitlabCI = generateGitLabCI(config);
    files.push(gitlabCI);
  }

  // Jenkins
  if (config.integrations.includes('jenkins')) {
    const jenkinsFile = generateJenkinsfile(config);
    files.push(jenkinsFile);
  }

  // Azure DevOps
  if (config.integrations.includes('azure-devops')) {
    const azurePipeline = generateAzurePipeline(config);
    files.push(azurePipeline);
  }

  return {
    files,
  };
}

function generateGitHubActionsWorkflow(config: PreviewConfiguration): ProjectFile {
  const content = `name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      matrix:
        browser: [${config.browsers.map(b => `'${b}'`).join(', ')}]
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps \${{ matrix.browser }}
    
    - name: Run Playwright tests
      run: npx playwright test --project=\${{ matrix.browser }}
      env:
        BASE_URL: \${{ secrets.BASE_URL }}
        API_BASE_URL: \${{ secrets.API_BASE_URL }}
        TEST_EMAIL: \${{ secrets.TEST_EMAIL }}
        TEST_PASSWORD: \${{ secrets.TEST_PASSWORD }}
    
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report-\${{ matrix.browser }}
        path: playwright-report/
        retention-days: 30

${config.environments.length > 1 ? `
  test-environments:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    strategy:
      matrix:
        environment: [${config.environments.map(env => `'${env}'`).join(', ')}]
    
    steps:
    - uses: actions/checkout@v4
    
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    
    - name: Run tests against \${{ matrix.environment }}
      run: npx playwright test
      env:
        BASE_URL: \${{ secrets[\${{ matrix.environment }}_BASE_URL] }}
        API_BASE_URL: \${{ secrets[\${{ matrix.environment }}_API_BASE_URL] }}
        TEST_EMAIL: \${{ secrets.TEST_EMAIL }}
        TEST_PASSWORD: \${{ secrets.TEST_PASSWORD }}
` : ''}

${config.integrations.includes('allure') ? `
  generate-report:
    if: always()
    needs: [test]
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Download all artifacts
      uses: actions/download-artifact@v4
    
    - name: Generate Allure Report
      uses: simple-elf/allure-report-action@v1.7
      with:
        allure_results: allure-results
        allure_report: allure-report
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: allure-report
` : ''}`;

  return {
    path: '.github/workflows/playwright.yml',
    content,
    description: 'GitHub Actions workflow for Playwright tests',
    category: 'ci',
    language: 'yaml',
  };
}

function generateGitLabCI(config: PreviewConfiguration): ProjectFile {
  const content = `image: mcr.microsoft.com/playwright:v1.40.0-focal

stages:
  - test
  - report

variables:
  npm_config_cache: "$CI_PROJECT_DIR/.npm"
  PLAYWRIGHT_BROWSERS_PATH: "$CI_PROJECT_DIR/.playwright"

cache:
  key: \${CI_COMMIT_REF_SLUG}
  paths:
    - .npm/
    - .playwright/
    - node_modules/

before_script:
  - npm ci
  - npx playwright install --with-deps

${config.browsers.map(browser => `
test:${browser}:
  stage: test
  script:
    - npx playwright test --project=${browser}
  artifacts:
    when: always
    paths:
      - playwright-report/
      - test-results/
    reports:
      junit: test-results/junit.xml
    expire_in: 1 week
  parallel: 2
`).join('')}

${config.environments.length > 1 ? config.environments.map(env => `
test:${env}:
  stage: test
  script:
    - npx playwright test
  variables:
    BASE_URL: \$${env.toUpperCase()}_BASE_URL
    API_BASE_URL: \$${env.toUpperCase()}_API_BASE_URL
  only:
    - branches
`).join('') : ''}

${config.integrations.includes('allure') ? `
generate_report:
  stage: report
  dependencies:
    - test:chromium
    - test:firefox
    - test:webkit
  script:
    - npm install -g allure-commandline
    - allure generate allure-results --clean -o allure-report
  artifacts:
    paths:
      - allure-report/
    expire_in: 1 week
  only:
    - main
    - develop
` : ''}

pages:
  stage: report
  dependencies:
    - test:chromium
  script:
    - mkdir public
    - cp -r playwright-report/* public/
  artifacts:
    paths:
      - public
  only:
    - main`;

  return {
    path: '.gitlab-ci.yml',
    content,
    description: 'GitLab CI/CD pipeline configuration',
    category: 'ci',
    language: 'yaml',
  };
}

function generateJenkinsfile(config: PreviewConfiguration): ProjectFile {
  const content = `pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.40.0-focal'
            args '-u root'
        }
    }
    
    environment {
        BASE_URL = credentials('base-url')
        API_BASE_URL = credentials('api-base-url')
        TEST_EMAIL = credentials('test-email')
        TEST_PASSWORD = credentials('test-password')
    }
    
    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
                sh 'npx playwright install --with-deps'
            }
        }
        
        stage('Run Tests') {
            parallel {
                ${config.browsers.map(browser => `
                stage('Test ${browser.charAt(0).toUpperCase() + browser.slice(1)}') {
                    steps {
                        sh 'npx playwright test --project=${browser}'
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: false,
                                keepAll: true,
                                reportDir: 'playwright-report',
                                reportFiles: 'index.html',
                                reportName: '${browser.charAt(0).toUpperCase() + browser.slice(1)} Test Report'
                            ])
                        }
                    }
                }
                `).join('')}
            }
        }
        
        ${config.environments.length > 1 ? `
        stage('Environment Tests') {
            parallel {
                ${config.environments.map(env => `
                stage('Test ${env.charAt(0).toUpperCase() + env.slice(1)}') {
                    environment {
                        BASE_URL = credentials('${env}-base-url')
                        API_BASE_URL = credentials('${env}-api-base-url')
                    }
                    steps {
                        sh 'npx playwright test'
                    }
                }
                `).join('')}
            }
        }
        ` : ''}
    }
    
    post {
        always {
            publishTestResults testResultsPattern: 'test-results/junit.xml'
            
            ${config.integrations.includes('allure') ? `
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
            ` : ''}
            
            archiveArtifacts artifacts: 'playwright-report/**/*', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
        }
        
        failure {
            emailext (
                subject: "Failed Pipeline: \${currentBuild.displayName}",
                body: "Something is wrong with \${env.BUILD_URL}",
                to: "\${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}`;

  return {
    path: 'Jenkinsfile',
    content,
    description: 'Jenkins pipeline configuration',
    category: 'ci',
  };
}

function generateAzurePipeline(config: PreviewConfiguration): ProjectFile {
  const content = `trigger:
  branches:
    include:
    - main
    - develop

pr:
  branches:
    include:
    - main
    - develop

pool:
  vmImage: 'ubuntu-latest'

variables:
  npm_config_cache: \$(Pipeline.Workspace)/.npm

stages:
- stage: Test
  displayName: 'Run Playwright Tests'
  jobs:
  ${config.browsers.map(browser => `
  - job: Test_${browser.charAt(0).toUpperCase() + browser.slice(1)}
    displayName: 'Test on ${browser.charAt(0).toUpperCase() + browser.slice(1)}'
    steps:
    - task: Cache@2
      inputs:
        key: 'npm | "\$(Agent.OS)" | package-lock.json'
        restoreKeys: |
          npm | "\$(Agent.OS)"
        path: \$(npm_config_cache)
      displayName: Cache npm
    
    - task: NodeTool@0
      inputs:
        versionSpec: '18'
      displayName: 'Install Node.js'
    
    - script: |
        npm ci
        npx playwright install --with-deps ${browser}
      displayName: 'Install dependencies'
    
    - script: npx playwright test --project=${browser}
      displayName: 'Run ${browser} tests'
      env:
        BASE_URL: \$(BASE_URL)
        API_BASE_URL: \$(API_BASE_URL)
        TEST_EMAIL: \$(TEST_EMAIL)
        TEST_PASSWORD: \$(TEST_PASSWORD)
    
    - task: PublishTestResults@2
      condition: always()
      inputs:
        testResultsFormat: 'JUnit'
        testResultsFiles: 'test-results/junit.xml'
        testRunTitle: '${browser.charAt(0).toUpperCase() + browser.slice(1)} Test Results'
    
    - task: PublishHtmlReport@1
      condition: always()
      inputs:
        reportDir: 'playwright-report'
        tabName: '${browser.charAt(0).toUpperCase() + browser.slice(1)} Report'
  `).join('')}

${config.environments.length > 1 ? `
- stage: EnvironmentTests
  displayName: 'Environment-specific Tests'
  dependsOn: Test
  jobs:
  ${config.environments.map(env => `
  - job: Test_${env.charAt(0).toUpperCase() + env.slice(1)}
    displayName: 'Test ${env.charAt(0).toUpperCase() + env.slice(1)} Environment'
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18'
      displayName: 'Install Node.js'
    
    - script: |
        npm ci
        npx playwright install --with-deps
      displayName: 'Install dependencies'
    
    - script: npx playwright test
      displayName: 'Run ${env} tests'
      env:
        BASE_URL: \$(${env.toUpperCase()}_BASE_URL)
        API_BASE_URL: \$(${env.toUpperCase()}_API_BASE_URL)
        TEST_EMAIL: \$(TEST_EMAIL)
        TEST_PASSWORD: \$(TEST_PASSWORD)
  `).join('')}
` : ''}

${config.integrations.includes('allure') ? `
- stage: Report
  displayName: 'Generate Reports'
  dependsOn: Test
  jobs:
  - job: AllureReport
    displayName: 'Generate Allure Report'
    steps:
    - task: NodeTool@0
      inputs:
        versionSpec: '18'
      displayName: 'Install Node.js'
    
    - script: |
        npm install -g allure-commandline
        allure generate allure-results --clean -o allure-report
      displayName: 'Generate Allure Report'
    
    - task: PublishHtmlReport@1
      inputs:
        reportDir: 'allure-report'
        tabName: 'Allure Report'
` : ''}`;

  return {
    path: 'azure-pipelines.yml',
    content,
    description: 'Azure DevOps pipeline configuration',
    category: 'ci',
    language: 'yaml',
  };
}