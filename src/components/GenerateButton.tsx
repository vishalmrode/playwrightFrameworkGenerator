import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Download, Zap, CheckCircle, Chrome, Globe, Monitor } from "lucide-react";
import { useState } from "react";
import { useAppSelector } from "@/hooks/redux";
import { getLanguageLabel } from "@/lib/SelectProgrammingLanguage";
import { getBrowserDisplayName } from "@/lib/ConfigureBrowserSettings";
import { generateFramework, GenerationProgress, GenerateState } from "@/lib/generateFramework";


const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

const GenerateButton = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [projectNameError, setProjectNameError] = useState('');

  // Optimized selectors to prevent unnecessary rerenders
  const selectedLanguage = useAppSelector((state) => state.language.selectedLanguage);
  const selectedBrowsers = useAppSelector((state) => (state.browser && state.browser.selectedBrowsers) ? state.browser.selectedBrowsers : { chromium: false, firefox: false, webkit: false });
  
    // Get full state for framework generation with proper UI theme
  const generateState = useAppSelector((state) => {
    const selectedNames = state.environment.selectedEnvironments && state.environment.selectedEnvironments.length > 0
      ? state.environment.selectedEnvironments
      : [state.environment.environments[0]?.name].filter(Boolean) as string[];
    // Use the first selected environment for top-level baseUrl/apiUrl, generator handles multiple projects
    const selectedEnv = state.environment.environments.find(env => env.name === selectedNames[0]) || state.environment.environments[0];
    
  const generatedState: GenerateState = {
      language: state.language,
      browser: state.browser,
      // testingCapabilities in GenerateState uses a loose index signature; cast to satisfy types
      testingCapabilities: state.testingCapabilities as unknown as { [key: string]: boolean },
      environment: {
        baseUrl: selectedEnv?.baseUrl || 'http://localhost:3000',
        apiUrl: selectedEnv?.baseUrl ? `${selectedEnv.baseUrl}/api` : 'http://localhost:3000/api',
        selectedEnvNames: selectedNames,
        // pass full project objects so generator can include exact per-environment values
  projects: state.environment.environments.map((e) => ({ name: e.name, baseUrl: e.baseUrl, apiUrl: e.baseUrl ? `${e.baseUrl}/api` : undefined }))
      },
      integrations: {
        'allure-reporter': { enabled: state.integrations.allureReporter.enabled },
        'github-actions': { enabled: state.integrations.githubActions.enabled },
        'cucumber': { enabled: state.integrations.cucumberIntegration.enabled },
        'faker': { enabled: state.integrations.fakerLibrary.enabled }
      },
      fixtures: {
        pageObjectPatterns: state.fixtures.pageObjectPatterns || []
      },
      docker: {
        enabled: state.docker.config.enabled || false
      },
      ciPipeline: {
        enabled: state.ciPipeline.enabled,
        workflows: state.ciPipeline.workflows,
        selectedWorkflowIndex: state.ciPipeline.selectedWorkflowIndex,
        globalSettings: state.ciPipeline.globalSettings
      },
      ui: { theme: state.ui.theme === 'system' ? 'light' : state.ui.theme }
    };
    
    return generatedState;
  });

  const selectedBrowsersList = Object.entries(selectedBrowsers)
    .filter(([_, selected]) => selected)
    .map(([browser, _]) => browser as keyof typeof selectedBrowsers);

  const getBrowserIcon = (browser: keyof typeof selectedBrowsers) => {
    switch (browser) {
      case 'chromium':
        return <Chrome className="w-3 h-3" />;
      case 'firefox':
        return <Globe className="w-3 h-3" />;
      case 'webkit':
        return <Monitor className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const canGenerate = selectedBrowsersList.length > 0;

  // Debug information to help diagnose disabled/non-clickable button issues in the browser
  // Leave logs minimal and helpful; can be removed after debugging
   
  console.debug('[GenerateButton] selectedBrowsersList=', selectedBrowsersList, 'canGenerate=', canGenerate, 'isGenerating=', isGenerating);

  const handleGenerate = async () => {
    if (!canGenerate) return;
    // Project name validation (assume input is in the DOM with data-testid="project-name-input")
    const projectNameInput = document.querySelector('[data-testid="project-name-input"]') as HTMLInputElement | null;
    if (projectNameInput && !projectNameInput.value.trim()) {
      setProjectNameError('Project name is required.');
      return;
    } else {
      setProjectNameError('');
    }
    let hadError = false;
    try {
      setIsGenerating(true);
      setProgress(0);

      const blob = await generateFramework(generateState, ({ progress, message }: GenerationProgress) => {
        setProgress(progress);
        setStatusMessage(message);
      });

      // Coerce various binary types into a browser Blob so download works reliably
      let outBlob: Blob;
      if (blob instanceof Blob) {
        outBlob = blob;
      } else if (typeof Buffer !== 'undefined' && typeof (Buffer as any).isBuffer === 'function' && (Buffer as any).isBuffer(blob)) {
        // Node Buffer -> Uint8Array
        outBlob = new Blob([new Uint8Array(blob as any)], { type: 'application/zip' });
      } else if (ArrayBuffer.isView && ArrayBuffer.isView(blob)) {
        // Uint8Array or other typed array / view
        const view = blob as ArrayBufferView;
        // If it's already a Uint8Array we can use it directly, otherwise create a view
        const arr = view instanceof Uint8Array ? view : new Uint8Array((view as any).buffer, (view as any).byteOffset, (view as any).byteLength);
        outBlob = new Blob([arr as any], { type: 'application/zip' });
      } else if (blob && typeof (blob as any).byteLength === 'number' && typeof (blob as any).slice === 'function') {
        // Likely an ArrayBuffer (runtime check). Convert to Uint8Array first.
        outBlob = new Blob([new Uint8Array(blob as any) as any], { type: 'application/zip' });
      } else {
        throw new Error('Failed to generate framework file: unsupported binary type');
      }

      // Use the project name as the zip filename, fallback to default if blank
      let zipName = 'playwright-framework.zip';
      if (projectNameInput && projectNameInput.value.trim()) {
        // Sanitize: remove unsafe characters, spaces to dashes, lowercased
        zipName = projectNameInput.value.trim()
          .replace(/[^a-zA-Z0-9-_]+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')
          .toLowerCase() + '.zip';
      }
      downloadBlob(outBlob, zipName);

      // Show success for a moment
      setProgress(100);
      setStatusMessage('Framework generation complete! Downloading...');
      setShowSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Clear the success message shortly after showing it so users see success
      setTimeout(() => {
        setStatusMessage('');
        setShowSuccess(false);
      }, 1200);
    } catch (error) {
      hadError = true;
      console.error('Error generating framework:', error);
      setStatusMessage(error instanceof Error ? error.message : 'Error generating framework. Please try again.');
      setShowSuccess(false);
    } finally {
      setIsGenerating(false);
      setProgress(0);
      // Don't immediately clear statusMessage on error so users can see the failure
      if (!hadError) {
        // already cleared above after success
      }
    }
  };

  return (
    <Card data-testid="generate-button-card">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Ready to Generate?</h3>
            <p className="text-sm text-muted-foreground">
              Your customized Playwright framework will be generated as a ZIP file
            </p>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary">{getLanguageLabel(selectedLanguage)}</Badge>
            {selectedBrowsersList.length > 0 ? (
              selectedBrowsersList.map(browser => (
                <Badge key={browser} variant="secondary" className="flex items-center gap-1">
                  {getBrowserIcon(browser)}
                  {getBrowserDisplayName(browser)}
                </Badge>
              ))
            ) : (
              <Badge variant="destructive">No Browsers Selected</Badge>
            )}
            <Badge variant="secondary">GitHub Actions</Badge>
            <Badge variant="secondary">Page Objects</Badge>
            <Badge variant="secondary">+ {selectedBrowsersList.length + 6} more features</Badge>
          </div>

          {!canGenerate && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive text-center">
                ⚠️ Please select at least one browser to generate the framework.
              </p>
            </div>
          )}

          {projectNameError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg" data-testid="project-name-error">
              <p className="text-sm text-destructive text-center">{projectNameError}</p>
            </div>
          )}

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>{statusMessage || 'Generating framework...'}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" data-testid="generation-progress" />
            </div>
          )}

          <Button 
            onClick={handleGenerate}
            disabled={isGenerating || !canGenerate}
            size="lg" 
            className="w-full"
            data-testid="generate-button"
          >
            {isGenerating ? (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generating Framework...
              </>
            ) : progress === 100 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                Download Complete!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate & Download Framework
              </>
            )}
          </Button>

          {showSuccess && (
            <div className="flex items-center justify-center mt-4 text-green-600" data-testid="generation-success">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Framework generated successfully!</span>
            </div>
          )}

          <div className="text-xs text-center text-muted-foreground">
            <p>Estimated size: ~2.5MB • Includes all dependencies and examples</p>
            {selectedBrowsersList.length > 0 && (
              <p>Browser support: {selectedBrowsersList.map(getBrowserDisplayName).join(', ')}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default GenerateButton;