/**
 * PreviewPanel.tsx
 * Purpose: Show a live preview of the generated project structure, key
 * configuration snippets and sample test code based on current selections.
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderTree, Settings, Code, Chrome, Globe, Monitor } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { getLanguageExtensions } from "@/lib/SelectProgrammingLanguage";
import { generateBrowserProjects, generatePackageScripts, getBrowserDisplayName } from "@/lib/ConfigureBrowserSettings";

export function PreviewPanel() {
  const selectedLanguage = useAppSelector((state) => state.language.selectedLanguage);
  const { selectedBrowsers } = useAppSelector(state => state.browser);
  const extensions = getLanguageExtensions(selectedLanguage);
  const configFile = selectedLanguage === 'typescript' ? 'playwright.config.ts' : 'playwright.config.js';
  const specFile = selectedLanguage === 'typescript' ? 'example.spec.ts' : 'example.spec.js';
  const fixtureFile = selectedLanguage === 'typescript' ? 'base.ts' : 'base.js';
  const pageFile = selectedLanguage === 'typescript' ? 'HomePage.ts' : 'HomePage.js';
  const helperFile = selectedLanguage === 'typescript' ? 'helpers.ts' : 'helpers.js';

  const selectedBrowsersList = Object.entries(selectedBrowsers)
    .filter(([_, selected]) => selected)
    .map(([browser, _]) => browser as keyof typeof selectedBrowsers);

  const browserProjects = generateBrowserProjects(selectedBrowsers);
  const packageScripts = generatePackageScripts(selectedBrowsers);

  // avoid unused variable warning in preview-only builds
  void extensions;

  const getBrowserIcon = (browser: string) => {
    switch (browser) {
      case 'chromium':
        return <Chrome className="w-3 h-3 text-blue-500" />;
      case 'firefox':
        return <Globe className="w-3 h-3 text-orange-500" />;
      case 'webkit':
        return <Monitor className="w-3 h-3 text-gray-600" />;
      default:
        return null;
    }
  };
  return (
    <Card data-testid="preview-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderTree className="w-5 h-5" />
          Project Preview
        </CardTitle>
        {selectedBrowsersList.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedBrowsersList.map(browser => (
              <Badge key={browser} variant="outline" className="flex items-center gap-1">
                {getBrowserIcon(browser)}
                {getBrowserDisplayName(browser)}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="structure" data-testid="preview-tabs">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="config">Config</TabsTrigger>
            <TabsTrigger value="sample">Sample</TabsTrigger>
          </TabsList>
          
          <TabsContent value="structure" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <FolderTree className="w-4 h-4" />
                <span className="text-sm font-medium">Project Structure</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                <strong>Note:</strong> This is a visual representation for guidance only. The actual generated project may differ.
              </div>
              <ScrollArea className="h-64" data-testid="project-structure">
                <div className="space-y-1 text-sm font-mono">
                  <div>📁 playwright-framework/</div>
                  <div className="ml-4">📄 package.json</div>
                  <div className="ml-4">📄 {configFile}</div>
                  {selectedLanguage === 'typescript' && (
                    <div className="ml-4">📄 tsconfig.json</div>
                  )}
                  <div className="ml-4">📄 .env.example</div>
                  <div className="ml-4">📁 tests/</div>
                  <div className="ml-8">📄 {specFile}</div>
                  {selectedBrowsers.webkit && (
                    <div className="ml-8">📄 webkit-specific.spec.{selectedLanguage === 'typescript' ? 'ts' : 'js'}</div>
                  )}
                  <div className="ml-8">📁 fixtures/</div>
                  <div className="ml-12">📄 {fixtureFile}</div>
                  <div className="ml-8">📁 pages/</div>
                  <div className="ml-12">📄 {pageFile}</div>
                  <div className="ml-4">📁 test-data/</div>
                  <div className="ml-8">📄 users.json</div>
                  <div className="ml-4">📁 utils/</div>
                  <div className="ml-8">📄 {helperFile}</div>
                  <div className="ml-4">📁 .github/</div>
                  <div className="ml-8">📁 workflows/</div>
                  <div className="ml-12">📄 playwright.yml</div>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="config" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Key Configurations</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                <strong>Note:</strong> This is a visual representation for guidance only. The actual generated configuration files may differ.
              </div>
              <ScrollArea className="h-64" data-testid="config-preview">
                <div className="space-y-3">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{configFile}</Badge>
                    </div>
                    <code className="text-xs block whitespace-pre-wrap">
                      {`projects: [`}
                      {browserProjects.length > 0 ? (
                        browserProjects.map((project, index) => (
                          `\n  { name: '${project.name}', use: { browserName: '${project.use.browserName}' } }${index < browserProjects.length - 1 ? ',' : ''}`
                        )).join('')
                      ) : (
                        '\n  // No browsers selected'
                      )}
                      {`\n]`}
                    </code>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">package.json</Badge>
                    </div>
                    <code className="text-xs block whitespace-pre-wrap">
                      {`scripts: {`}
                      {Object.entries(packageScripts).slice(0, 6).map(([key, value], index, arr) => (
                        `\n  "${key}": "${value}"${index < arr.length - 1 ? ',' : ''}`
                      )).join('')}
                      {Object.keys(packageScripts).length > 6 && '\n  // ... more scripts'}
                      {`\n}`}
                    </code>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="sample" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">Sample Test</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                <strong>Note:</strong> This is a sample for demonstration only. The actual generated test code may differ.
              </div>
              <ScrollArea className="h-64" data-testid="sample-code">
                <div className="p-3 bg-muted rounded-lg">
                  <code className="text-xs block">
                    {selectedBrowsersList.length > 0 ? (
                      selectedLanguage === 'typescript' ? (
                        <>
                          import {`{ test, expect }`} from '@playwright/test';<br/><br/>
                          test('cross-browser compatibility', async ({`{ page, browserName }`}) =&gt; {`{`}<br/>
                          &nbsp;&nbsp;console.log(`Running on: ${'${browserName}'}`);<br/>
                          &nbsp;&nbsp;await page.goto('/');<br/>
                          &nbsp;&nbsp;await expect(page).toHaveTitle(/My App/);<br/>
                          <br/>
                          &nbsp;&nbsp;// Browser-specific logic<br/>
                          {selectedBrowsers.chromium && (
                            <>
                              &nbsp;&nbsp;if (browserName === 'chromium') {`{`}<br/>
                              &nbsp;&nbsp;&nbsp;&nbsp;// Chrome-specific tests<br/>
                              &nbsp;&nbsp;{`}`}<br/>
                            </>
                          )}
                          {selectedBrowsers.firefox && (
                            <>
                              &nbsp;&nbsp;if (browserName === 'firefox') {`{`}<br/>
                              &nbsp;&nbsp;&nbsp;&nbsp;// Firefox-specific tests<br/>
                              &nbsp;&nbsp;{`}`}<br/>
                            </>
                          )}
                          {selectedBrowsers.webkit && (
                            <>
                              &nbsp;&nbsp;if (browserName === 'webkit') {`{`}<br/>
                              &nbsp;&nbsp;&nbsp;&nbsp;// Safari-specific tests<br/>
                              &nbsp;&nbsp;{`}`}<br/>
                            </>
                          )}
                          {`}`});<br/>
                          <br/>
                          test('will run on: {selectedBrowsersList.map(getBrowserDisplayName).join(', ')}', async ({`{ page }`}) =&gt; {`{`}<br/>
                          &nbsp;&nbsp;// This test runs on all selected browsers<br/>
                          &nbsp;&nbsp;await page.goto('/');<br/>
                          &nbsp;&nbsp;await expect(page.locator('h1')).toBeVisible();<br/>
                          {`}`});
                        </>
                      ) : (
                        <>
                          const {`{ test, expect }`} = require('@playwright/test');<br/><br/>
                          test('cross-browser compatibility', async ({`{ page, browserName }`}) =&gt; {`{`}<br/>
                          &nbsp;&nbsp;console.log(`Running on: ${'${browserName}'}`);<br/>
                          &nbsp;&nbsp;await page.goto('/');<br/>
                          &nbsp;&nbsp;await expect(page).toHaveTitle(/My App/);<br/>
                          <br/>
                          &nbsp;&nbsp;// Browser-specific logic<br/>
                          {selectedBrowsers.chromium && (
                            <>
                              &nbsp;&nbsp;if (browserName === 'chromium') {`{`}<br/>
                              &nbsp;&nbsp;&nbsp;&nbsp;// Chrome-specific tests<br/>
                              &nbsp;&nbsp;{`}`}<br/>
                            </>
                          )}
                          {selectedBrowsers.firefox && (
                            <>
                              &nbsp;&nbsp;if (browserName === 'firefox') {`{`}<br/>
                              &nbsp;&nbsp;&nbsp;&nbsp;// Firefox-specific tests<br/>
                              &nbsp;&nbsp;{`}`}<br/>
                            </>
                          )}
                          {selectedBrowsers.webkit && (
                            <>
                              &nbsp;&nbsp;if (browserName === 'webkit') {`{`}<br/>
                              &nbsp;&nbsp;&nbsp;&nbsp;// Safari-specific tests<br/>
                              &nbsp;&nbsp;{`}`}<br/>
                            </>
                          )}
                          {`}`});<br/>
                          <br/>
                          test('will run on: {selectedBrowsersList.map(getBrowserDisplayName).join(', ')}', async ({`{ page }`}) =&gt; {`{`}<br/>
                          &nbsp;&nbsp;// This test runs on all selected browsers<br/>
                          &nbsp;&nbsp;await page.goto('/');<br/>
                          &nbsp;&nbsp;await expect(page.locator('h1')).toBeVisible();<br/>
                          {`}`});
                        </>
                      )
                    ) : (
                      <>
                        // No browsers selected<br/>
                        // Please select at least one browser<br/>
                        // to generate test examples
                      </>
                    )}
                  </code>
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default PreviewPanel;