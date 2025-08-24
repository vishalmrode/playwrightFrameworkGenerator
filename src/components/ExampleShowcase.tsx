import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Globe, TestTube, FileCode, Layers } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { getLanguageExtensions } from "@/lib/SelectProgrammingLanguage";
import type { RootState } from "@/store";

interface CodeExampleProps {
  title: string;
  description: string;
  filename: string;
  code: string;
}

const CodeExample: React.FC<CodeExampleProps> = ({ title, description, filename, code }) => {
  return (
    <div className="space-y-2">
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="relative">
        <div className="absolute top-0 right-0 bg-muted px-2 py-1 rounded-bl text-xs font-mono">
          {filename}
        </div>
        <pre className="p-4 rounded-lg bg-muted font-mono text-sm overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export function ExampleShowcase() {
  const [openSections, setOpenSections] = React.useState<string[]>(['ui-tests']);
  const selectedLanguage = useAppSelector((state: RootState) => state.language.selectedLanguage);
  const fileExtension = React.useMemo(() => getLanguageExtensions(selectedLanguage), [selectedLanguage]);

  const toggleSection = (section: string) => {
    setOpenSections((prev: string[]) =>
      prev.includes(section)
        ? prev.filter((s: string) => s !== section)
        : [...prev, section]
    );
  };  return (
    <Card data-testid="example-showcase">
      <CardHeader>
        <CardTitle>Example Tests & Usage Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Collapsible 
            open={openSections.includes('ui-tests')}
            onOpenChange={() => toggleSection('ui-tests')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80" data-testid="ui-tests-trigger">
              <div className="flex items-center gap-2">
                <TestTube className="w-4 h-4" />
                <span className="font-medium">UI Test Examples</span>
                <Badge variant="secondary">5 examples</Badge>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ScrollArea className="h-48" data-testid="ui-tests-content">
                <div className="space-y-4">
                  <CodeExample
                    title="Login Flow Test"
                    description="Example of login form testing with assertions"
                    filename={`tests/login.spec.${fileExtension}`}
                    code={`test('user can login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');
  await expect(page).toHaveURL('/dashboard');
});`}
                  />

                  <CodeExample
                    title="Form Validation Test"
                    description="Testing form validation messages"
                    filename={`tests/form-validation.spec.${fileExtension}`}
                    code={`test('form shows validation errors', async ({ page }) => {
  await page.goto('/signup');
  await page.click('[data-testid="submit"]');
  await expect(page.locator('.error-message')).toBeVisible();
});`}
                  />
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openSections.includes('api-tests')}
            onOpenChange={() => toggleSection('api-tests')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80" data-testid="api-tests-trigger">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="font-medium">API Test Examples</span>
                <Badge variant="secondary">3 examples</Badge>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ScrollArea className="h-48" data-testid="api-tests-content">
                <div className="space-y-4">
                  <CodeExample
                    title="GET Request Test"
                    description="Testing a GET API endpoint with response validation"
                    filename={`tests/api/users.spec.${fileExtension}`}
                    code={`test('GET /api/users returns user list', async ({ request }) => {
  const response = await request.get('/api/users');
  expect(response.status()).toBe(200);
  const users = await response.json();
  expect(users).toHaveLength(10);
});`}
                  />

                  <CodeExample
                    title="POST Request Test"
                    description="Testing a POST API endpoint with request data"
                    filename={`tests/api/create-user.spec.${fileExtension}`}
                    code={`test('POST /api/users creates new user', async ({ request }) => {
  const userData = { name: 'John Doe', email: 'john@example.com' };
  const response = await request.post('/api/users', { data: userData });
  expect(response.status()).toBe(201);
});`}
                  />
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openSections.includes('page-objects')}
            onOpenChange={() => toggleSection('page-objects')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80" data-testid="page-objects-trigger">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span className="font-medium">Page Object Patterns</span>
                <Badge variant="secondary">2 examples</Badge>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ScrollArea className="h-48" data-testid="page-objects-content">
                <div className="space-y-4">
                  <CodeExample
                    title="Page Object Pattern"
                    description="Example of a Page Object class with methods"
                    filename={`pages/home.page.${fileExtension}`}
                    code={`export class HomePage {
  constructor(private page: Page) {}

  // Navigation
  async goto() {
    await this.page.goto('/');
  }

  // Actions
  async clickLoginButton() {
    await this.page.click('[data-testid="login-btn"]');
  }

  // Elements
  async getWelcomeText() {
    return this.page.textContent('[data-testid="welcome"]');
  }
}`}
                  />
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible 
            open={openSections.includes('fixtures')}
            onOpenChange={() => toggleSection('fixtures')}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80" data-testid="fixtures-trigger">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                <span className="font-medium">Custom Fixtures</span>
                <Badge variant="secondary">4 examples</Badge>
              </div>
              <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ScrollArea className="h-48" data-testid="fixtures-content">
                <div className="space-y-4">
                  <CodeExample
                    title="Custom Test Fixtures"
                    description="Setting up reusable test fixtures with Playwright"
                    filename={`fixtures/base.${fileExtension}`}
                    code={`import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';

export const test = base.extend<{
  homePage: HomePage;
  authenticatedUser: User;
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  authenticatedUser: async ({ page }, use) => {
    // Login logic here
    const user = await loginUser(page);
    await use(user);
    // Cleanup after test
    await logoutUser(page);
  }
});

export { expect } from '@playwright/test';`}
                  />

                  <CodeExample
                    title="Using Fixtures"
                    description="Example of using custom fixtures in tests"
                    filename={`tests/dashboard.spec.${fileExtension}`}
                    code={`import { test } from '../fixtures/base';

test('authenticated user can access dashboard', async ({
  homePage,
  authenticatedUser
}) => {
  await homePage.goto();
  const welcomeText = await homePage.getWelcomeText();
  expect(welcomeText).toContain(authenticatedUser.name);
});`}
                  />
                </div>
              </ScrollArea>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  );
}

export default ExampleShowcase;