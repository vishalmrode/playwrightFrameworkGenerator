/**
 * FixturesConfiguration.tsx
 * Purpose: UI for selecting test fixture patterns, data strategies and related
 * settings used to generate sample fixture files and test helpers.
 */
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Database, 
  Settings, 
  RefreshCw, 
  Shield, 
  Puzzle,
  Clock,
  Play,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  togglePageObjectPattern,
  updateTestDataStrategy,
  toggleSetupTeardownPattern,
  toggleAuthenticationFixture,
  updateAuthenticationFixture,
  toggleCustomFixture,
  updateFixtureSettings,
  setPreset,
  bulkToggleFixtures,
} from "@/store/slices/fixturesSlice";
import { 
  validateFixturesConfiguration, 
  getFixturesDescription,
  getFixtureConflicts,
  getFixtureRecommendations 
} from "@/lib/ConfigureTestFixtures";

export function FixturesConfiguration() {
  const dispatch = useAppDispatch();
  const fixtures = useAppSelector(state => state.fixtures);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const validation = validateFixturesConfiguration(fixtures);
  const conflicts = getFixtureConflicts(fixtures);
  const recommendations = getFixtureRecommendations(fixtures);

  // ensure the Play icon import is referenced in builds where JSX transforms differ
  void Play;

  const handlePresetChange = (preset: 'minimal' | 'standard' | 'comprehensive') => {
    dispatch(setPreset(preset));
  };

  const handleBulkToggle = (category: 'pageObjects' | 'setupTeardown' | 'authentication' | 'custom', enabled: boolean) => {
    dispatch(bulkToggleFixtures({ category, enabled }));
  };

  return (
    <Card data-testid="fixtures-configuration">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Puzzle className="w-5 h-5" />
          Test Fixtures & Data Management
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {validation.isValid ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-destructive" />
          )}
          <span>{getFixturesDescription(fixtures)}</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patterns" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="patterns" data-testid="patterns-tab">Patterns</TabsTrigger>
            <TabsTrigger value="data" data-testid="data-tab">Data</TabsTrigger>
            <TabsTrigger value="auth" data-testid="auth-tab">Auth</TabsTrigger>
            <TabsTrigger value="settings" data-testid="settings-tab">Settings</TabsTrigger>
          </TabsList>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Label className="text-sm font-medium">Quick Presets:</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetChange('minimal')}
              data-testid="preset-minimal"
            >
              Minimal
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetChange('standard')}
              data-testid="preset-standard"
            >
              Standard
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handlePresetChange('comprehensive')}
              data-testid="preset-comprehensive"
            >
              Comprehensive
            </Button>
          </div>

          <TabsContent value="patterns" className="space-y-4">
            <div className="space-y-4">
              {/* Page Object Patterns */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Page Object Patterns
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkToggle('pageObjects', true)}
                      data-testid="enable-all-page-objects"
                    >
                      Enable All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkToggle('pageObjects', false)}
                      data-testid="disable-all-page-objects"
                    >
                      Disable All
                    </Button>
                  </div>
                </div>

                {fixtures.pageObjectPatterns.map(pattern => (
                  <div key={pattern.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={pattern.id}
                      checked={pattern.enabled}
                      onCheckedChange={() => dispatch(togglePageObjectPattern(pattern.id))}
                      data-testid={`${pattern.id}-checkbox`}
                    />
                    <Label htmlFor={pattern.id} className="flex flex-col cursor-pointer">
                      <span className="font-medium">{pattern.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {pattern.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>

              {/* Setup/Teardown Patterns */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Setup & Teardown Patterns
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkToggle('setupTeardown', true)}
                      data-testid="enable-all-setup-teardown"
                    >
                      Enable All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkToggle('setupTeardown', false)}
                      data-testid="disable-all-setup-teardown"
                    >
                      Disable All
                    </Button>
                  </div>
                </div>

                {fixtures.setupTeardownPatterns.map(pattern => (
                  <div key={pattern.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={pattern.id}
                      checked={pattern.enabled}
                      onCheckedChange={() => dispatch(toggleSetupTeardownPattern(pattern.id))}
                      data-testid={`${pattern.id}-checkbox`}
                    />
                    <Label htmlFor={pattern.id} className="flex flex-col cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{pattern.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {pattern.scope}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {pattern.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            {/* Test Data Strategy */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Database className="w-4 h-4" />
                Test Data Strategy
              </Label>
              
              <Select 
                value={fixtures.testDataStrategy.strategy} 
                onValueChange={(value) => 
                  dispatch(updateTestDataStrategy({ 
                    strategy: value as any,
                    description: `${value} data management strategy`
                  }))
                }
                data-testid="data-strategy-select"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="isolated">Isolated per test</SelectItem>
                  <SelectItem value="shared">Shared across tests</SelectItem>
                  <SelectItem value="persistent">Persistent test data</SelectItem>
                  <SelectItem value="factory">Factory pattern</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm">File Format</Label>
                  <Select 
                    value={fixtures.testDataStrategy.fileFormat} 
                    onValueChange={(value) => 
                      dispatch(updateTestDataStrategy({ fileFormat: value as any }))
                    }
                    data-testid="file-format-select"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="yaml">YAML</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="data-strategy-enabled"
                    checked={fixtures.testDataStrategy.enabled}
                    onCheckedChange={(checked) => 
                      dispatch(updateTestDataStrategy({ enabled: checked }))
                    }
                    data-testid="data-strategy-enabled-switch"
                  />
                  <Label htmlFor="data-strategy-enabled" className="text-sm">
                    Enable data management
                  </Label>
                </div>
              </div>
            </div>

            {/* Custom Fixtures */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Utility Fixtures
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    data-testid="toggle-advanced"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggle('custom', true)}
                    data-testid="enable-all-custom"
                  >
                    Enable All
                  </Button>
                </div>
              </div>

              {fixtures.customFixtures
                .filter(fixture => showAdvanced || !fixture.advanced)
                .map(fixture => (
                  <div key={fixture.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={fixture.id}
                      checked={fixture.enabled}
                      onCheckedChange={() => dispatch(toggleCustomFixture(fixture.id))}
                      data-testid={`${fixture.id}-checkbox`}
                    />
                    <Label htmlFor={fixture.id} className="flex flex-col cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{fixture.name}</span>
                        <Badge variant={fixture.advanced ? "destructive" : "secondary"} className="text-xs">
                          {fixture.category}
                        </Badge>
                        {fixture.advanced && (
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Advanced fixture - requires additional setup
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {fixture.description}
                      </span>
                    </Label>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="auth" className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Authentication Fixtures
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggle('authentication', true)}
                    data-testid="enable-all-auth"
                  >
                    Enable All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggle('authentication', false)}
                    data-testid="disable-all-auth"
                  >
                    Disable All
                  </Button>
                </div>
              </div>

              {fixtures.authenticationFixtures.map(fixture => (
                <div key={fixture.id} className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={fixture.id}
                      checked={fixture.enabled}
                      onCheckedChange={() => dispatch(toggleAuthenticationFixture(fixture.id))}
                      data-testid={`${fixture.id}-checkbox`}
                    />
                    <Label htmlFor={fixture.id} className="flex flex-col cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{fixture.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {fixture.method}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {fixture.description}
                      </span>
                    </Label>
                  </div>
                  
                  {fixture.enabled && (
                    <div className="ml-8 space-y-2">
                      <Label className="text-xs text-muted-foreground">Authentication Method</Label>
                      <Select
                        value={fixture.method}
                        onValueChange={(value) =>
                          dispatch(updateAuthenticationFixture({
                            id: fixture.id,
                            updates: { method: value as any }
                          }))
                        }
                        data-testid={`${fixture.id}-method-select`}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="session">Session-based</SelectItem>
                          <SelectItem value="cookie">Cookie-based</SelectItem>
                          <SelectItem value="token">Bearer Token</SelectItem>
                          <SelectItem value="basic-auth">Basic Auth</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {/* Global Settings */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Global Settings</Label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="reusable-components"
                    checked={fixtures.reusableComponents}
                    onCheckedChange={(checked) => 
                      dispatch(updateFixtureSettings({ reusableComponents: checked }))
                    }
                    data-testid="reusable-components-switch"
                  />
                  <Label htmlFor="reusable-components" className="text-sm">
                    Reusable Components
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="global-fixtures"
                    checked={fixtures.globalFixtures}
                    onCheckedChange={(checked) => 
                      dispatch(updateFixtureSettings({ globalFixtures: checked }))
                    }
                    data-testid="global-fixtures-switch"
                  />
                  <Label htmlFor="global-fixtures" className="text-sm">
                    Global Fixtures
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="parallel-safe"
                    checked={fixtures.parallelSafe}
                    onCheckedChange={(checked) => 
                      dispatch(updateFixtureSettings({ parallelSafe: checked }))
                    }
                    data-testid="parallel-safe-switch"
                  />
                  <Label htmlFor="parallel-safe" className="text-sm">
                    Parallel-Safe
                  </Label>
                </div>
              </div>

              {/* Fixture Timeout */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <Label className="text-sm">
                    Fixture Timeout: {Math.round(fixtures.fixtureTimeout / 1000)}s
                  </Label>
                </div>
                <Slider
                  value={[fixtures.fixtureTimeout]}
                  onValueChange={([value]) => 
                    dispatch(updateFixtureSettings({ fixtureTimeout: value }))
                  }
                  min={5000}
                  max={300000}
                  step={5000}
                  className="w-full"
                  data-testid="fixture-timeout-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5s</span>
                  <span>300s</span>
                </div>
              </div>
            </div>

            {/* Validation & Recommendations */}
            {(validation.errors.length > 0 || validation.warnings.length > 0 || conflicts.length > 0) && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Configuration Issues
                </Label>
                
                {validation.errors.map((error, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-destructive">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
                
                {validation.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-amber-600">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{warning}</span>
                  </div>
                ))}

                {conflicts.map((conflict, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-destructive">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div>{conflict.reason}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Resolution: {conflict.resolution}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {recommendations.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-blue-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Recommendations
                </Label>
                
                {recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                    <div>
                      <span>{rec.reason}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {rec.impact} impact
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default FixturesConfiguration;