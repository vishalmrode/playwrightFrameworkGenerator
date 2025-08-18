import { ProjectFile, PreviewConfiguration } from '../types';

interface DockerGenerationResult {
  files: ProjectFile[];
}

/**
 * Generates Docker configuration files
 */
export function generateDockerFiles(config: PreviewConfiguration): DockerGenerationResult {
  const files: ProjectFile[] = [];

  // Main Dockerfile
  const dockerfile = generateDockerfile(config);
  files.push(dockerfile);

  // Docker Compose
  const dockerCompose = generateDockerCompose(config);
  files.push(dockerCompose);

  // Docker ignore
  const dockerIgnore = generateDockerIgnore();
  files.push(dockerIgnore);

  // Docker entrypoint script
  const entrypoint = generateEntrypoint(config);
  files.push(entrypoint);

  return {
    files,
  };
}

function generateDockerfile(config: PreviewConfiguration): ProjectFile {
  const content = `# Use Playwright base image with all browsers pre-installed
FROM mcr.microsoft.com/playwright:v1.40.0-focal

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=test
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Install additional system dependencies if needed
RUN apt-get update && apt-get install -y \\
    curl \\
    vim \\
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
${config.language === 'typescript' ? 'COPY tsconfig.json ./' : ''}

# Install Node.js dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy test files
COPY tests/ tests/
COPY playwright.config.${config.language === 'typescript' ? 'ts' : 'js'} ./
${config.language === 'typescript' ? 'COPY tsconfig.json ./' : ''}

# Copy environment file template
COPY .env.example .env

# Create directories for test results and reports
RUN mkdir -p test-results playwright-report screenshots

# Set permissions
RUN chown -R pwuser:pwuser /app
USER pwuser

# Copy entrypoint script
COPY --chown=pwuser:pwuser docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port for HTML report server
EXPOSE 9323

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]

# Default command
CMD ["test"]`;

  return {
    path: 'Dockerfile',
    content,
    description: 'Docker configuration for containerized testing',
    category: 'docker',
    language: 'dockerfile',
  };
}

function generateDockerCompose(config: PreviewConfiguration): ProjectFile {
  const content = `version: '3.8'

services:
  playwright-tests:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: playwright-framework
    environment:
      - BASE_URL=\${BASE_URL:-http://app:3000}
      - API_BASE_URL=\${API_BASE_URL:-http://api:3001}
      - TEST_EMAIL=\${TEST_EMAIL:-test@example.com}
      - TEST_PASSWORD=\${TEST_PASSWORD:-testpass123}
      - HEADLESS=\${HEADLESS:-true}
      - CI=\${CI:-false}
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
      - ./screenshots:/app/screenshots
      - ./videos:/app/videos
    networks:
      - test-network
    depends_on:
      - app
      ${config.capabilities.includes('apiTesting') ? '- api' : ''}
    command: ["test"]

  # Application under test
  app:
    image: nginx:alpine
    container_name: test-app
    ports:
      - "3000:80"
    volumes:
      - ./test-app:/usr/share/nginx/html:ro
    networks:
      - test-network

  ${config.capabilities.includes('apiTesting') ? `
  # API server for testing
  api:
    image: node:18-alpine
    container_name: test-api
    ports:
      - "3001:3001"
    volumes:
      - ./test-api:/app:ro
    working_dir: /app
    command: ["npm", "start"]
    networks:
      - test-network
  ` : ''}

  ${config.integrations.includes('database') ? `
  # Database for testing
  db:
    image: postgres:15-alpine
    container_name: test-db
    environment:
      - POSTGRES_DB=testdb
      - POSTGRES_USER=testuser
      - POSTGRES_PASSWORD=testpass
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - test-network
  ` : ''}

  # Playwright report server
  report-server:
    image: nginx:alpine
    container_name: playwright-report
    ports:
      - "9323:80"
    volumes:
      - ./playwright-report:/usr/share/nginx/html:ro
    networks:
      - test-network
    depends_on:
      - playwright-tests

networks:
  test-network:
    driver: bridge

${config.integrations.includes('database') ? `
volumes:
  postgres_data:
` : ''}`;

  return {
    path: 'docker-compose.yml',
    content,
    description: 'Docker Compose configuration for full testing environment',
    category: 'docker',
    language: 'yaml',
  };
}

function generateDockerIgnore(): ProjectFile {
  const content = `# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Test results and reports
test-results/
playwright-report/
screenshots/
videos/
allure-results/
allure-report/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Git
.git/
.gitignore

# CI/CD
.github/
.gitlab-ci.yml
azure-pipelines.yml
Jenkinsfile

# Documentation
README.md
docs/
*.md

# Temporary files
tmp/
temp/
*.tmp
*.temp

# Coverage reports
coverage/
.nyc_output/

# Build artifacts
dist/
build/`;

  return {
    path: '.dockerignore',
    content,
    description: 'Docker ignore file to exclude unnecessary files from build context',
    category: 'docker',
  };
}

function generateEntrypoint(config: PreviewConfiguration): ProjectFile {
  const content = `#!/bin/bash
set -e

# Function to print with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to wait for service to be ready
wait_for_service() {
    local host=$1
    local port=$2
    local service_name=$3
    
    log "Waiting for $service_name to be ready at $host:$port..."
    
    for i in {1..30}; do
        if nc -z "$host" "$port" > /dev/null 2>&1; then
            log "$service_name is ready!"
            return 0
        fi
        log "Waiting for $service_name... (attempt $i/30)"
        sleep 2
    done
    
    log "ERROR: $service_name is not ready after 60 seconds"
    return 1
}

# Function to run health checks
health_check() {
    local url=$1
    local service_name=$2
    
    log "Running health check for $service_name at $url"
    
    for i in {1..10}; do
        if curl -f -s "$url" > /dev/null; then
            log "$service_name health check passed!"
            return 0
        fi
        log "Health check failed for $service_name... (attempt $i/10)"
        sleep 3
    done
    
    log "WARNING: $service_name health check failed after 30 seconds"
    return 1
}

# Set default values
HEADLESS=\${HEADLESS:-true}
BASE_URL=\${BASE_URL:-http://app:3000}
API_BASE_URL=\${API_BASE_URL:-http://api:3001}

log "Starting Playwright Test Runner"
log "BASE_URL: $BASE_URL"
log "API_BASE_URL: $API_BASE_URL"
log "HEADLESS: $HEADLESS"

# Wait for application to be ready
if [[ $BASE_URL == http://app:* ]]; then
    wait_for_service "app" "80" "Application"
    health_check "$BASE_URL" "Application"
fi

${config.capabilities.includes('apiTesting') ? `
# Wait for API to be ready
if [[ $API_BASE_URL == http://api:* ]]; then
    wait_for_service "api" "3001" "API"
    health_check "$API_BASE_URL/health" "API"
fi
` : ''}

# Handle different commands
case "$1" in
    test)
        log "Running all tests..."
        exec npx playwright test
        ;;
    test:ui)
        log "Running tests in UI mode..."
        exec npx playwright test --ui --ui-host=0.0.0.0
        ;;
    test:debug)
        log "Running tests in debug mode..."
        exec npx playwright test --debug
        ;;
    test:headed)
        log "Running tests in headed mode..."
        HEADLESS=false exec npx playwright test --headed
        ;;
    ${config.browsers.map(browser => `
    test:${browser})
        log "Running tests on ${browser}..."
        exec npx playwright test --project=${browser}
        ;;`).join('')}
    report)
        log "Starting report server..."
        exec npx playwright show-report --host=0.0.0.0
        ;;
    install)
        log "Installing Playwright browsers..."
        exec npx playwright install --with-deps
        ;;
    shell)
        log "Starting interactive shell..."
        exec /bin/bash
        ;;
    *)
        log "Available commands:"
        log "  test         - Run all tests"
        log "  test:ui      - Run tests in UI mode"
        log "  test:debug   - Run tests in debug mode"
        log "  test:headed  - Run tests in headed mode"
        ${config.browsers.map(browser => `log "  test:${browser}   - Run tests on ${browser}"`).join('\n        ')}
        log "  report       - Start report server"
        log "  install      - Install Playwright browsers"
        log "  shell        - Start interactive shell"
        log ""
        log "Running custom command: $*"
        exec "$@"
        ;;
esac`;

  return {
    path: 'docker-entrypoint.sh',
    content,
    description: 'Docker entrypoint script for flexible test execution',
    category: 'docker',
    language: 'shell',
  };
}