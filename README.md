# Playwright Test Framework Generator

An intuitive web application for generating customized test automation frameworks with Playwright.

## Features

- Language: TypeScript
- Latest Node.js LTS (20.x)
- Latest Playwright version (1.41.2)
- Customizable Testing Capabilities:
  - UI Testing
  - API Testing
  - Visual Testing
  - Performance Testing
  - Accessibility Testing
  - Cross-browser Testing
- CI/CD Integration
- Docker Support
- Reporting Tools

## Prerequisites

Before running this application or using the generated framework, ensure you have:

1. Node.js (version 16 or later)

   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. npm (comes with Node.js)

   - Verify installation: `npm --version`

3. Git (for version control)

   - Download from [git-scm.com](https://git-scm.com/)
   - Verify installation: `git --version`

4. A modern web browser (Chrome, Firefox, or Edge)

## Running the Generator

1. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Using the Generated Framework

After generating and downloading your test framework:

1. Extract the downloaded ZIP file

2. Install framework dependencies:

   ```bash
   cd [framework-directory]
   npm install
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

4. Install system dependencies:

   ```bash
   npx playwright install-deps
   ```

5. Configure environment variables:

   - Copy `.env.example` to `.env`
   - Update the values in `.env` file

6. Run the tests:
   ```bash
   npm test
   ```

### Additional Setup Based on Selected Features

#### Docker Support (if enabled)

1. Install Docker Desktop

   - Download from [docker.com](https://www.docker.com/products/docker-desktop/)
   - Verify installation: `docker --version`

2. Build and run tests in container:
   ```bash
   docker build -t playwright-tests .
   docker run playwright-tests
   ```

#### Allure Reporting (if enabled)

1. Install Allure command-line tool:

   ```bash
   npm install -g allure-commandline
   ```

2. Generate and view reports:
   ```bash
   npm run test:report
   ```

#### Visual Testing (if enabled)

1. Install additional dependencies:

   ```bash
   npm install @playwright/test
   ```

2. Update baseline images:
   ```bash
   npx playwright test --update-snapshots
   ```

## Windows Users: Fix File Associations

If .ts/.tsx files are opening in Windows Media Player, follow these steps to fix:

1. Open Windows Settings
2. Go to Apps > Default Apps
3. Scroll down and click "Choose default apps by file type"
4. Scroll to .ts and .tsx extensions
5. Click the current default app and change it to "Visual Studio Code" or your preferred text editor

You can also fix this by running the following command in PowerShell as administrator:

```powershell
ftype TypeScriptFile="%ProgramFiles%\Microsoft VS Code\Code.exe" "%1"
assoc .ts=TypeScriptFile
assoc .tsx=TypeScriptFile
```

## Project Structure

```
├── tests/             # Test files
├── pages/            # Page objects
│   ├── components/   # Reusable components
│   └── models/       # Page models
├── api/              # API tests
│   ├── client/       # API client
│   ├── models/       # API models
│   └── tests/        # API test files
├── playwright.config.ts  # Playwright configuration
└── package.json      # Project configuration
```
