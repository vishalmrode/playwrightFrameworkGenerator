export const USER_MANUAL_MD = "# Playwright Framework Generator - User Manual\n\n" +
	"This manual explains each feature in plain language and how to use it.\n\n" +
	"## Quick overview\n" +
	"Open the app, select options, click Generate, and download a ready-to-run Playwright framework.\n\n" +
	"## Features\n\n" +
	"- Language selection: TypeScript or JavaScript\n" +
	"- Browser selection: Chromium, Firefox, WebKit\n" +
	"- Testing capabilities: UI, API, Visual, Accessibility, Performance\n" +
	"- Integrations: GitHub Actions, Allure, Cucumber, Faker, JUnit\n" +
	"- Fixtures and environment settings\n" +
	"- Docker support and CI pipeline\n\n" +
	"## How to use\n\n" +
	"1. Start the app: `npm run dev`\n" +
	"2. Choose options in the UI\n" +
	"3. Preview the project\n" +
	"4. Click Generate and download the ZIP\n\n" +
	"## Running the generated framework\n\n" +
	"1. Unzip the generated project\n" +
	"2. `npm install`\n" +
	"3. `npx playwright install`\n" +
	"4. `npm test`\n\n" +
	"## Troubleshooting\n\n" +
	"- If a browser is missing: run `npx playwright install`\n" +
	"- If env vars are missing: copy `.env.example` to `.env`\n" +
	"- For Docker on Apple Silicon, use multi-arch images or `--platform linux/amd64`\n";

export default USER_MANUAL_MD;
