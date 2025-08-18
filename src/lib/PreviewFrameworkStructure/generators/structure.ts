import { ProjectFile } from '../types';

/**
 * Generates directory structure based on project files
 */
export function generateDirectoryStructure(files: ProjectFile[]): string[] {
  const directories = new Set<string>();

  // Extract directories from file paths
  files.forEach(file => {
    const pathParts = file.path.split('/');
    
    // Add all parent directories
    for (let i = 0; i < pathParts.length - 1; i++) {
      const dirPath = pathParts.slice(0, i + 1).join('/');
      directories.add(dirPath);
    }
  });

  // Add common directories that might not have files yet
  const commonDirs = [
    'tests',
    'tests/pages',
    'tests/fixtures',
    'tests/utils',
    'test-data',
    'test-results',
    'playwright-report',
    'screenshots',
    'videos',
    'allure-results',
    'allure-report',
  ];

  commonDirs.forEach(dir => directories.add(dir));

  // Convert to sorted array
  return Array.from(directories).sort();
}

/**
 * Get directory tree visualization
 */
export function getDirectoryTree(directories: string[]): string {
  const tree = buildTree(directories);
  return renderTree(tree);
}

interface TreeNode {
  name: string;
  children: Map<string, TreeNode>;
  isDirectory: boolean;
}

function buildTree(paths: string[]): TreeNode {
  const root: TreeNode = {
    name: 'playwright-framework',
    children: new Map(),
    isDirectory: true,
  };

  paths.forEach(path => {
    const parts = path.split('/');
    let current = root;

    parts.forEach(part => {
      if (!current.children.has(part)) {
        current.children.set(part, {
          name: part,
          children: new Map(),
          isDirectory: true,
        });
      }
      current = current.children.get(part)!;
    });
  });

  return root;
}

function renderTree(node: TreeNode, prefix = '', isLast = true): string {
  const lines = [];
  const connector = isLast ? '└── ' : '├── ';
  const icon = node.isDirectory ? '📁' : '📄';
  
  if (prefix || node.name !== 'playwright-framework') {
    lines.push(prefix + connector + icon + ' ' + node.name);
  } else {
    lines.push('📁 ' + node.name);
  }

  const children = Array.from(node.children.values());
  children.forEach((child, index) => {
    const isLastChild = index === children.length - 1;
    const childPrefix = prefix + (isLast ? '    ' : '│   ');
    lines.push(renderTree(child, childPrefix, isLastChild));
  });

  return lines.join('\n');
}

/**
 * Get file organization by category
 */
export function getFilesByCategory(files: ProjectFile[]): Record<string, ProjectFile[]> {
  const categories: Record<string, ProjectFile[]> = {
    config: [],
    test: [],
    page: [],
    fixture: [],
    util: [],
    ci: [],
    docker: [],
    docs: [],
  };

  files.forEach(file => {
    if (categories[file.category]) {
      categories[file.category].push(file);
    } else {
      categories[file.category] = [file];
    }
  });

  return categories;
}

/**
 * Get project statistics
 */
export function getProjectStats(files: ProjectFile[], directories: string[]) {
  const stats = {
    totalFiles: files.length,
    totalDirectories: directories.length,
    filesByCategory: {} as Record<string, number>,
    filesByLanguage: {} as Record<string, number>,
    averageFileSize: 0,
    largestFile: null as ProjectFile | null,
    smallestFile: null as ProjectFile | null,
  };

  // Count by category
  files.forEach(file => {
    stats.filesByCategory[file.category] = (stats.filesByCategory[file.category] || 0) + 1;
  });

  // Count by language
  files.forEach(file => {
    if (file.language) {
      stats.filesByLanguage[file.language] = (stats.filesByLanguage[file.language] || 0) + 1;
    }
  });

  // File size statistics
  const fileSizes = files.map(f => f.content.length);
  if (fileSizes.length > 0) {
    stats.averageFileSize = Math.round(fileSizes.reduce((a, b) => a + b, 0) / fileSizes.length);
    
    const maxSize = Math.max(...fileSizes);
    const minSize = Math.min(...fileSizes);
    
    stats.largestFile = files.find(f => f.content.length === maxSize) || null;
    stats.smallestFile = files.find(f => f.content.length === minSize) || null;
  }

  return stats;
}

/**
 * Generate README content for the project
 */
export function generateProjectReadme(files: ProjectFile[], directories: string[]): ProjectFile {
  const filesByCategory = getFilesByCategory(files);
  const stats = getProjectStats(files, directories);
  const tree = getDirectoryTree(directories);

  const content = `# Playwright Testing Framework

This is an auto-generated Playwright testing framework with comprehensive test automation capabilities.

## 📊 Project Overview

- **Total Files**: ${stats.totalFiles}
- **Total Directories**: ${stats.totalDirectories}
- **Configuration Files**: ${stats.filesByCategory.config || 0}
- **Test Files**: ${stats.filesByCategory.test || 0}
- **Page Objects**: ${stats.filesByCategory.page || 0}
- **Fixtures**: ${stats.filesByCategory.fixture || 0}
- **Utilities**: ${stats.filesByCategory.util || 0}

## 🏗️ Project Structure

\`\`\`
${tree}
\`\`\`

## 🚀 Quick Start

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Install Playwright Browsers**
   \`\`\`bash
   npx playwright install
   \`\`\`

3. **Run Tests**
   \`\`\`bash
   npm run test
   \`\`\`

## 📋 Available Scripts

- \`npm run test\` - Run all tests
- \`npm run test:ui\` - Run tests with UI mode
- \`npm run test:headed\` - Run tests in headed mode
- \`npm run test:debug\` - Run tests in debug mode
- \`npm run report\` - Show test report

${Object.keys(stats.filesByLanguage).length > 0 ? `
## 🔧 Technologies Used

${Object.entries(stats.filesByLanguage).map(([lang, count]) => `- **${lang.charAt(0).toUpperCase() + lang.slice(1)}**: ${count} files`).join('\n')}
` : ''}

## 📁 Key Components

### Configuration Files
${filesByCategory.config?.map(f => `- \`${f.path}\` - ${f.description}`).join('\n') || 'None'}

### Test Files  
${filesByCategory.test?.map(f => `- \`${f.path}\` - ${f.description}`).join('\n') || 'None'}

### Page Objects
${filesByCategory.page?.map(f => `- \`${f.path}\` - ${f.description}`).join('\n') || 'None'}

### Fixtures
${filesByCategory.fixture?.map(f => `- \`${f.path}\` - ${f.description}`).join('\n') || 'None'}

${filesByCategory.docker?.length ? `
## 🐳 Docker Support

This project includes Docker configuration for containerized testing:

${filesByCategory.docker.map(f => `- \`${f.path}\` - ${f.description}`).join('\n')}

### Running with Docker

\`\`\`bash
# Build and run tests
docker-compose up --build

# Run specific browser tests
docker-compose run playwright-tests test:chromium

# Access test reports
docker-compose up report-server
\`\`\`
` : ''}

${filesByCategory.ci?.length ? `
## 🔄 CI/CD Integration

The framework includes CI/CD configurations for:

${filesByCategory.ci.map(f => `- \`${f.path}\` - ${f.description}`).join('\n')}
` : ''}

## 📝 Environment Variables

Copy \`.env.example\` to \`.env\` and configure the following variables:

- \`BASE_URL\` - Application URL to test against
- \`API_BASE_URL\` - API base URL for API tests
- \`TEST_EMAIL\` - Test user email
- \`TEST_PASSWORD\` - Test user password

## 🎯 Test Organization

Tests are organized by:
- **Feature**: Tests grouped by application features
- **Type**: UI tests, API tests, visual tests, etc.
- **Environment**: Tests can run against different environments
- **Browser**: Cross-browser compatibility testing

## 📊 Reporting

Test results are available in multiple formats:
- HTML Report: \`playwright-report/index.html\`
- JSON Report: \`test-results/results.json\`
- JUnit Report: \`test-results/junit.xml\`

## 🔍 Debugging

- Use \`npm run test:debug\` to debug tests
- Use \`npm run test:headed\` to see tests run in browser
- Check screenshots in \`screenshots/\` directory for failed tests
- View videos in \`videos/\` directory for test recordings

## 🤝 Contributing

1. Follow the existing code structure
2. Add appropriate test data in \`test-data/\`
3. Use page objects for UI interactions
4. Add proper error handling and logging
5. Update documentation as needed

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

---

*This framework was auto-generated and configured for optimal testing practices.*`;

  return {
    path: 'README.md',
    content,
    description: 'Project documentation and setup guide',
    category: 'docs',
  };
}