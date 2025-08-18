import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  setGitHubActionsConfig,
  setAllureReporterConfig,
  setCucumberIntegrationConfig,
  setFakerLibraryConfig,
} from '@/store/slices/integrationsSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/credenza';
import { 
  GitBranch, 
  FileText, 
  Zap, 
  Users, 
  Settings, 
  ChevronDown,
  ChevronRight,
  Info,
} from 'lucide-react';
import { FAKER_LOCALES } from '@/lib/ConfigureIntegrations/types';
import { getEnabledIntegrationsDescription } from '@/lib/ConfigureIntegrations';

export function IntegrationsPanel() {
  const dispatch = useDispatch();
  const integrations = useSelector((state: RootState) => state.integrations);
  
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isSectionExpanded = (sectionId: string) => expandedSections.includes(sectionId);

  return (
    <Card data-testid="integrations-panel">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Integrations & Extensions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {getEnabledIntegrationsDescription(integrations)}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* GitHub Actions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="github-actions" className="flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">GitHub Actions</span>
                <span className="text-sm text-muted-foreground">CI/CD workflow automation</span>
              </div>
            </Label>
            <div className="flex items-center gap-2">
              {integrations.githubActions.enabled && (
                <Badge variant="secondary" className="text-xs">
                  {integrations.githubActions.workflowName}
                </Badge>
              )}
              <Switch 
                id="github-actions" 
                checked={integrations.githubActions.enabled}
                onCheckedChange={(checked) => 
                  dispatch(setGitHubActionsConfig({ enabled: checked }))
                }
                data-testid="github-actions-switch" 
              />
            </div>
          </div>
          
          {integrations.githubActions.enabled && (
            <Collapsible 
              open={isSectionExpanded('github-actions')}
              onOpenChange={() => toggleSection('github-actions')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0">
                  {isSectionExpanded('github-actions') ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  Advanced Settings
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-3">
                <div className="space-y-2">
                  <Label htmlFor="workflow-name" className="text-sm">Workflow Name</Label>
                  <Input
                    id="workflow-name"
                    value={integrations.githubActions.workflowName}
                    onChange={(e) => 
                      dispatch(setGitHubActionsConfig({ workflowName: e.target.value }))
                    }
                    placeholder="playwright-tests"
                    className="h-8"
                    data-testid="workflow-name-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Triggers</Label>
                  <div className="flex flex-wrap gap-2">
                    <Label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={integrations.githubActions.triggers.push}
                        onChange={(e) => 
                          dispatch(setGitHubActionsConfig({ 
                            triggers: { ...integrations.githubActions.triggers, push: e.target.checked }
                          }))
                        }
                        className="w-3 h-3"
                      />
                      Push
                    </Label>
                    <Label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={integrations.githubActions.triggers.pullRequest}
                        onChange={(e) => 
                          dispatch(setGitHubActionsConfig({ 
                            triggers: { ...integrations.githubActions.triggers, pullRequest: e.target.checked }
                          }))
                        }
                        className="w-3 h-3"
                      />
                      Pull Request
                    </Label>
                    <Label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={integrations.githubActions.triggers.schedule}
                        onChange={(e) => 
                          dispatch(setGitHubActionsConfig({ 
                            triggers: { ...integrations.githubActions.triggers, schedule: e.target.checked }
                          }))
                        }
                        className="w-3 h-3"
                      />
                      Scheduled
                    </Label>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        <Separator />

        {/* Allure Reporter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="allure-reporter" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">Allure Reporter</span>
                <span className="text-sm text-muted-foreground">Rich test reporting and analytics</span>
              </div>
            </Label>
            <div className="flex items-center gap-2">
              {integrations.allureReporter.enabled && (
                <Credenza>
                  <CredenzaTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Info className="w-4 h-4" />
                    </Button>
                  </CredenzaTrigger>
                  <CredenzaContent>
                    <CredenzaHeader>
                      <CredenzaTitle>Allure Reporter Features</CredenzaTitle>
                      <CredenzaDescription>
                        Comprehensive test reporting with rich visualizations
                      </CredenzaDescription>
                    </CredenzaHeader>
                    <CredenzaBody>
                      <ul className="list-disc pl-4 space-y-1 text-sm">
                        <li>Interactive HTML reports</li>
                        <li>Test execution history</li>
                        <li>Categorized test results</li>
                        <li>Screenshots and attachments</li>
                        <li>Performance metrics</li>
                      </ul>
                    </CredenzaBody>
                  </CredenzaContent>
                </Credenza>
              )}
              <Switch 
                id="allure-reporter" 
                checked={integrations.allureReporter.enabled}
                onCheckedChange={(checked) => 
                  dispatch(setAllureReporterConfig({ enabled: checked }))
                }
                data-testid="allure-reporter-switch" 
              />
            </div>
          </div>
          
          {integrations.allureReporter.enabled && (
            <Collapsible 
              open={isSectionExpanded('allure-reporter')}
              onOpenChange={() => toggleSection('allure-reporter')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0">
                  {isSectionExpanded('allure-reporter') ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  Report Settings
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={integrations.allureReporter.generateReport}
                      onChange={(e) => 
                        dispatch(setAllureReporterConfig({ generateReport: e.target.checked }))
                      }
                      className="w-3 h-3"
                    />
                    Generate HTML Report
                  </Label>
                  <Label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={integrations.allureReporter.publishToPages}
                      onChange={(e) => 
                        dispatch(setAllureReporterConfig({ publishToPages: e.target.checked }))
                      }
                      className="w-3 h-3"
                    />
                    Publish to GitHub Pages
                  </Label>
                  <Label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={integrations.allureReporter.categories}
                      onChange={(e) => 
                        dispatch(setAllureReporterConfig({ categories: e.target.checked }))
                      }
                      className="w-3 h-3"
                    />
                    Test Categories
                  </Label>
                  <Label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={integrations.allureReporter.history}
                      onChange={(e) => 
                        dispatch(setAllureReporterConfig({ history: e.target.checked }))
                      }
                      className="w-3 h-3"
                    />
                    Test History
                  </Label>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        <Separator />

        {/* Cucumber Integration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="cucumber-integration" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">Cucumber Integration</span>
                <span className="text-sm text-muted-foreground">BDD test scenarios and Gherkin support</span>
              </div>
            </Label>
            <div className="flex items-center gap-2">
              {integrations.cucumberIntegration.enabled && (
                <Badge variant="secondary" className="text-xs">
                  BDD
                </Badge>
              )}
              <Switch 
                id="cucumber-integration" 
                checked={integrations.cucumberIntegration.enabled}
                onCheckedChange={(checked) => 
                  dispatch(setCucumberIntegrationConfig({ enabled: checked }))
                }
                data-testid="cucumber-integration-switch" 
              />
            </div>
          </div>
          
          {integrations.cucumberIntegration.enabled && (
            <Collapsible 
              open={isSectionExpanded('cucumber-integration')}
              onOpenChange={() => toggleSection('cucumber-integration')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0">
                  {isSectionExpanded('cucumber-integration') ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  Directory Settings
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-3">
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="features-path" className="text-sm">Features Directory</Label>
                    <Input
                      id="features-path"
                      value={integrations.cucumberIntegration.featuresPath}
                      onChange={(e) => 
                        dispatch(setCucumberIntegrationConfig({ featuresPath: e.target.value }))
                      }
                      placeholder="features"
                      className="h-8"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="steps-path" className="text-sm">Steps Directory</Label>
                    <Input
                      id="steps-path"
                      value={integrations.cucumberIntegration.stepsPath}
                      onChange={(e) => 
                        dispatch(setCucumberIntegrationConfig({ stepsPath: e.target.value }))
                      }
                      placeholder="steps"
                      className="h-8"
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        <Separator />

        {/* Faker Library */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="faker-library" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">Faker Library</span>
                <span className="text-sm text-muted-foreground">Test data generation and mocking</span>
              </div>
            </Label>
            <div className="flex items-center gap-2">
              {integrations.fakerLibrary.enabled && (
                <Badge variant="secondary" className="text-xs">
                  {integrations.fakerLibrary.locale.toUpperCase()}
                </Badge>
              )}
              <Switch 
                id="faker-library" 
                checked={integrations.fakerLibrary.enabled}
                onCheckedChange={(checked) => 
                  dispatch(setFakerLibraryConfig({ enabled: checked }))
                }
                data-testid="faker-library-switch" 
              />
            </div>
          </div>
          
          {integrations.fakerLibrary.enabled && (
            <Collapsible 
              open={isSectionExpanded('faker-library')}
              onOpenChange={() => toggleSection('faker-library')}
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start p-0">
                  {isSectionExpanded('faker-library') ? (
                    <ChevronDown className="w-4 h-4 mr-2" />
                  ) : (
                    <ChevronRight className="w-4 h-4 mr-2" />
                  )}
                  Data Types & Locale
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 pt-3">
                <div className="space-y-2">
                  <Label className="text-sm">Locale</Label>
                  <Select
                    value={integrations.fakerLibrary.locale}
                    onValueChange={(value) => 
                      dispatch(setFakerLibraryConfig({ locale: value }))
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FAKER_LOCALES.map((locale) => (
                        <SelectItem key={locale.value} value={locale.value}>
                          {locale.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Data Types</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(integrations.fakerLibrary.includeTypes).map(([type, enabled]) => (
                      <Label key={type} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => 
                            dispatch(setFakerLibraryConfig({ 
                              includeTypes: { 
                                ...integrations.fakerLibrary.includeTypes, 
                                [type]: e.target.checked 
                              }
                            }))
                          }
                          className="w-3 h-3"
                        />
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Label>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default IntegrationsPanel;