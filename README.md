
# Playwright Test Framework Generator

An intuitive web application for generating customized test automation frameworks with Playwright.

## Supported Languages

- **TypeScript** (`.ts`)
- **JavaScript** (`.js`)
- **Python** (`.py`)
- **C#** (`.cs`)
- **Java** (`.java`)

> **Note:** All generated files, test examples, and configuration will match your selected language.

## Features

- Language selection: TypeScript, JavaScript, Python, C#, Java
- Latest Node.js LTS (20.x) for JS/TS
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

**TypeScript/JavaScript:**
- Node.js (version 16 or later)
- npm (comes with Node.js)
- Git (for version control)

**Python:**
- Python 3.8+
- pip

**C#:**
- .NET 6+ SDK

**Java:**
- Java 11+ JDK
- Maven or Gradle (recommended)

**All languages:**
- A modern web browser (Chrome, Firefox, or Edge)


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

2. Install framework dependencies (per language):

    - **TypeScript/JavaScript:**
       ```bash
       cd [framework-directory]
       npm install
       ```
    - **Python:**
       ```bash
       cd [framework-directory]
       pip install -r requirements.txt
       ```
    - **C#:**
       ```bash
       cd [framework-directory]
       dotnet restore
       ```
    - **Java:**
       ```bash
       cd [framework-directory]
       mvn install
       # or
       gradle build
       ```

3. Install Playwright browsers:
    - **TypeScript/JavaScript:**
       ```bash
       npx playwright install
       npx playwright install-deps
       ```
    - **Python:**
       ```bash
       python -m playwright install
       python -m playwright install-deps
       ```
    - **C#:**
       ```bash
       pwsh
       playwright install
       playwright install-deps
       ```
    - **Java:**
       ```bash
       mvn exec:java -Dexec.mainClass=com.microsoft.playwright.CLI -Dexec.args="install"
       # or use Gradle equivalent
       ```

4. Configure environment variables:
    - Copy `.env.example` to `.env`
    - Update the values in `.env` file

5. Run the tests:
    - **TypeScript/JavaScript:**
       ```bash
       npm test
       ```
    - **Python:**
       ```bash
       pytest
       ```
    - **C#:**
       ```bash
       dotnet test
       ```
    - **Java:**
       ```bash
       mvn test
       # or
       gradle test
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
    - **TypeScript/JavaScript:**
       ```bash
       npm install -g allure-commandline
       ```
    - **Python:**
       ```bash
       pip install allure-pytest
       ```
    - **C#:**
       (see Allure C# docs)
    - **Java:**
       (see Allure Java docs)
2. Generate and view reports:
    - **TypeScript/JavaScript:**
       ```bash
       npm run test:report
       ```
    - **Python:**
       ```bash
       pytest --alluredir=allure-results
       allure serve allure-results
       ```

#### Visual Testing (if enabled)

1. Install additional dependencies:
    - **TypeScript/JavaScript:**
       ```bash
       npm install @playwright/test
       ```
    - **Python:**
       ```bash
       pip install playwright pytest-playwright-snapshot
       ```
2. Update baseline images:
    - **TypeScript/JavaScript:**
       ```bash
       npx playwright test --update-snapshots
       ```
    - **Python:**
       ```bash
       pytest --snapshot-update
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


## Project Structure (per language)

### TypeScript/JavaScript
```
├── tests/             # Test files
├── pages/            # Page objects
│   ├── components/   # Reusable components
│   └── models/       # Page models
├── api/              # API tests
│   ├── client/       # API client
│   ├── models/       # API models
│   └── tests/        # API test files
├── playwright.config.ts|js  # Playwright configuration
└── package.json      # Project configuration
```

### Python
```
├── tests/             # Test files (pytest style)
├── pages/             # Page objects (Python classes)
├── api/               # API tests
├── playwright.config.py  # Playwright configuration (if generated)
├── requirements.txt   # Python dependencies
└── conftest.py        # Pytest fixtures (if generated)
```

### C#
```
├── Tests/             # Test files (NUnit/xUnit)
├── Pages/             # Page objects (C# classes)
├── Api/               # API tests
├── PlaywrightConfig.cs  # Playwright configuration (if generated)
├── Project.csproj     # C# project file
└── ...
```

### Java
```
├── src/test/java/    # Test files (JUnit/TestNG)
├── src/main/java/    # Page objects, API clients
├── PlaywrightConfig.java  # Playwright configuration (if generated)
├── pom.xml           # Maven project file
├── build.gradle      # Gradle project file (if used)
└── ...
```
