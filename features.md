A web-based tool to configure and generate a complete Playwright test automation framework with all modern testing practices and integrations.
# Layout
Here is how the application is laid out for the user.
Not all features are implemented yet, so not all components are working.
## Page /
The main configuration page where users customize their Playwright framework and generate downloadable files.
Components on the page:
- Header: Application title and brief description of the framework generator
- LanguageSelector: Radio buttons to choose between TypeScript and JavaScript for the generated framework
- BrowserConfiguration: Checkboxes for browser selection (Chromium, Firefox, Safari) with all browsers pre-selected
- TestingCapabilities: Checkboxes to enable UI testing, API testing, or both with descriptions
- IntegrationsPanel: Configuration options for GitHub Actions, Allure reporter, Cucumber integration, and Faker library settings
- FixturesConfiguration: Options to configure test fixtures, data management, and setup/teardown patterns
- EnvironmentSettings: Configuration for multiple test environments (dev, staging, prod) with custom settings
- CodeQualityOptions: Settings for ESLint, Prettier, and TypeScript configuration preferences
- CIConfiguration: GitHub Actions workflow customization options for test execution and reporting
- DockerOptions: Optional Docker configuration for containerized test execution
- PreviewPanel: Live preview of the project structure and key configuration files being generated
- GenerateButton: Primary action button to generate and download the complete framework as a ZIP file
- ExampleShowcase: Expandable sections showing example test files and usage patterns that will be included
- Footer: Links to documentation and information about the generated framework features
# Features
Here are the features that have been implemented so far to make the app work.
## Feature DisplayApplicationHeader
Shows the application title and brief description of the framework generator.
Displays a header with the application name "Playwright Framework Generator" and a brief description explaining that this tool helps users create a complete test automation framework with modern practices and integrations.
## Feature SelectProgrammingLanguage
Allows users to choose between TypeScript and JavaScript for their generated framework.
Provides radio button options for users to select either TypeScript (recommended for type safety) or JavaScript (simpler setup) as the primary language for their generated Playwright framework. This choice affects all generated files, configurations, and examples.
## Feature ConfigureBrowserSettings
Enables users to select which browsers to include in their Playwright configuration.
Provides checkboxes for Chromium, Firefox, and Safari browsers with all browsers pre-selected by default. The selection determines which browsers will be configured in the generated Playwright config file and affects the generated test examples and CI pipeline configurations.
## Feature ConfigureTestingCapabilities
Allows users to enable UI testing, API testing, or both capabilities in their framework.
Provides checkboxes with descriptions for UI testing (web interface automation) and API testing (REST/GraphQL endpoint testing). Users can select one or both options, which determines the generated test utilities, example files, and framework structure.
## Feature ConfigureIntegrations
Provides configuration options for GitHub Actions, Allure reporter, Cucumber integration, and Faker library.
Offers toggles and configuration options for key integrations including GitHub Actions CI/CD pipeline, Allure HTML reporting, Cucumber BDD framework integration, and Faker library for dynamic test data generation. Each integration can be enabled/disabled and customized with specific settings.
## Feature ConfigureTestFixtures
Provides options to configure test fixtures, data management, and setup/teardown patterns.
Allows users to customize fixture configurations including page object patterns, test data management strategies, database setup/teardown, authentication fixtures, and reusable test components. Users can select from predefined patterns or specify custom fixture requirements.
## Feature ConfigureEnvironmentSettings
Enables configuration for multiple test environments with custom settings.
Provides interface to configure multiple testing environments (development, staging, production) with environment-specific URLs, credentials, and configuration overrides. Users can add custom environments and specify different settings for each environment including base URLs, timeouts, and feature flags.
## Feature ConfigureCodeQuality
Provides settings for ESLint, Prettier, and TypeScript configuration preferences.
Offers configuration options for code quality tools including ESLint rules and plugins, Prettier formatting preferences, and TypeScript compiler options. Users can select from preset configurations or customize rules to match their team's coding standards.
## Feature ConfigureCIPipeline
Provides GitHub Actions workflow customization options for test execution and reporting.
Allows users to customize their GitHub Actions CI pipeline including trigger conditions (push, pull request), test execution strategies (parallel, sequential), reporting options, artifact storage, and notification settings. Users can configure multiple workflow files for different scenarios.
## Feature ConfigureDockerization
Provides optional Docker configuration for containerized test execution.
Offers Docker setup options including Dockerfile generation, docker-compose configurations for services, container-based test execution, and integration with CI pipelines. Users can choose to enable Docker support and customize container configurations for consistent test environments.