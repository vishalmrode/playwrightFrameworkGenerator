import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Palette, FileType, Settings, RotateCcw, AlertTriangle } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { supportsTypeChecking } from "@/lib/SelectProgrammingLanguage";
import { 
  toggleESLint,
  setESLintConfig,
  togglePrettier,
  setPrettierConfig,
  toggleTypeScriptStrict,
  setTypeScriptTarget,
  setPrettierTabWidth,
  togglePrettierSemi,
  togglePrettierSingleQuote,
  setPrettierTrailingComma,
  setPrettierPrintWidth,
  toggleExactOptionalPropertyTypes,
  toggleNoUncheckedIndexedAccess,
  toggleNoImplicitOverride,
  resetToDefaults
} from "@/store/slices/codeQualitySlice";
import { ESLINT_CONFIGS, PRETTIER_CONFIGS, TYPESCRIPT_TARGETS } from "@/types/codeQuality";
import { validateConfiguration } from "@/lib/ConfigureCodeQuality";

export function CodeQualityOptions() {
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector((state) => state.language.selectedLanguage);
  const settings = useAppSelector((state) => state.codeQuality.settings);
  const hasTypeSupport = supportsTypeChecking(selectedLanguage);

  const validation = validateConfiguration(settings);

  const handleESLintToggle = () => {
    dispatch(toggleESLint());
  };

  const handlePrettierToggle = () => {
    dispatch(togglePrettier());
  };

  const handleTypeScriptStrictToggle = () => {
    dispatch(toggleTypeScriptStrict());
  };

  const handleResetToDefaults = () => {
    dispatch(resetToDefaults());
  };

  return (
    <Card data-testid="code-quality-options">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-left">Code Quality & Standards</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetToDefaults}
            data-testid="reset-defaults"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tools" className="justify-start text-left">Tools</TabsTrigger>
            <TabsTrigger value="prettier" className="justify-start text-left">Prettier</TabsTrigger>
            <TabsTrigger value="typescript" className="justify-start text-left">TypeScript</TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="space-y-6">
            {/* ESLint Section */}
            <div className="flex items-center justify-between">
              <Label htmlFor="eslint" className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4" />
                <div className="flex flex-col text-left">
                  <span className="font-medium">ESLint</span>
                  <span className="text-sm text-muted-foreground">Code linting and error detection</span>
                </div>
              </Label>
              <Switch 
                id="eslint" 
                checked={settings.eslint.enabled}
                onCheckedChange={handleESLintToggle}
                data-testid="eslint-switch" 
              />
            </div>

            {settings.eslint.enabled && (
              <div className="ml-6 space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">ESLint Configuration</Label>
                  <Select 
                    value={settings.eslint.config} 
                    onValueChange={(value) => dispatch(setESLintConfig(value as any))}
                    data-testid="eslint-config-select"
                  >
                    <SelectTrigger className="w-full text-left">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ESLINT_CONFIGS.map((config) => (
                        <SelectItem key={config.value} value={config.value}>
                          <div className="flex flex-col">
                            <span>{config.label}</span>
                            <span className="text-xs text-muted-foreground">{config.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-xs text-muted-foreground">
                  Plugins: {settings.eslint.plugins.join(', ')}
                </div>
              </div>
            )}

            {/* Prettier Section */}
            <div className="flex items-center justify-between">
              <Label htmlFor="prettier" className="flex items-start gap-2">
                <Palette className="w-4 h-4" />
                <div className="flex flex-col text-left">
                  <span className="font-medium">Prettier</span>
                  <span className="text-sm text-muted-foreground">Code formatting and styling</span>
                </div>
              </Label>
              <Switch 
                id="prettier" 
                checked={settings.prettier.enabled}
                onCheckedChange={handlePrettierToggle}
                data-testid="prettier-switch" 
              />
            </div>

            {settings.prettier.enabled && (
              <div className="ml-6 space-y-2">
                <Label className="text-sm font-medium">Prettier Configuration</Label>
                <Select 
                  value={settings.prettier.config} 
                  onValueChange={(value) => dispatch(setPrettierConfig(value as any))}
                  data-testid="prettier-config-select"
                >
                  <SelectTrigger className="w-full text-left">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRETTIER_CONFIGS.map((config) => (
                      <SelectItem key={config.value} value={config.value}>
                        <div className="flex flex-col">
                          <span>{config.label}</span>
                          <span className="text-xs text-muted-foreground">{config.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* TypeScript Section */}
            {hasTypeSupport && (
              <div className="flex items-center justify-between">
                <Label htmlFor="typescript-strict" className="flex items-start gap-2">
                  <FileType className="w-4 h-4" />
                  <div className="flex flex-col text-left">
                    <span className="font-medium">TypeScript Strict Mode</span>
                    <span className="text-sm text-muted-foreground">Enhanced type checking and validation</span>
                  </div>
                </Label>
                <Switch 
                  id="typescript-strict" 
                  checked={settings.typescript.strict}
                  onCheckedChange={handleTypeScriptStrictToggle}
                  data-testid="typescript-strict-switch" 
                />
              </div>
            )}

            {hasTypeSupport && (
              <div className="ml-6 space-y-2">
                <Label className="text-sm font-medium">TypeScript Target</Label>
                <Select 
                  value={settings.typescript.target} 
                  onValueChange={(value) => dispatch(setTypeScriptTarget(value as any))}
                  data-testid="typescript-target-select"
                >
                  <SelectTrigger className="w-full text-left">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPESCRIPT_TARGETS.map((target) => (
                      <SelectItem key={target.value} value={target.value}>
                        <div className="flex flex-col">
                          <span>{target.label}</span>
                          <span className="text-xs text-muted-foreground">{target.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </TabsContent>

          <TabsContent value="prettier" className="space-y-4">
            {settings.prettier.enabled ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tab-width" className="text-sm font-medium">Tab Width</Label>
                    <Input
                      id="tab-width"
                      type="number"
                      min="1"
                      max="8"
                      value={settings.prettier.tabWidth}
                      onChange={(e) => dispatch(setPrettierTabWidth(parseInt(e.target.value) || 2))}
                      data-testid="prettier-tab-width"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="print-width" className="text-sm font-medium">Print Width</Label>
                    <Input
                      id="print-width"
                      type="number"
                      min="40"
                      max="200"
                      value={settings.prettier.printWidth}
                      onChange={(e) => dispatch(setPrettierPrintWidth(parseInt(e.target.value) || 80))}
                      data-testid="prettier-print-width"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="semicolons" className="text-sm font-medium">Semicolons</Label>
                    <Switch 
                      id="semicolons"
                      checked={settings.prettier.semi}
                      onCheckedChange={() => dispatch(togglePrettierSemi())}
                      data-testid="prettier-semi-switch"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="single-quotes" className="text-sm font-medium">Single Quotes</Label>
                    <Switch 
                      id="single-quotes"
                      checked={settings.prettier.singleQuote}
                      onCheckedChange={() => dispatch(togglePrettierSingleQuote())}
                      data-testid="prettier-single-quote-switch"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Trailing Comma</Label>
                    <Select 
                      value={settings.prettier.trailingComma} 
                      onValueChange={(value) => dispatch(setPrettierTrailingComma(value as any))}
                      data-testid="prettier-trailing-comma-select"
                    >
                      <SelectTrigger className="w-full text-left">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="es5">ES5</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Enable Prettier in the Tools tab to configure formatting options</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="typescript" className="space-y-4">
            {hasTypeSupport ? (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="exact-optional" className="text-sm font-medium flex flex-col">
                      <span>Exact Optional Property Types</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        Requires strict mode for effectiveness
                      </span>
                    </Label>
                    <Switch 
                      id="exact-optional"
                      checked={settings.typescript.exactOptionalPropertyTypes}
                      onCheckedChange={() => dispatch(toggleExactOptionalPropertyTypes())}
                      data-testid="exact-optional-switch"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="no-unchecked" className="text-sm font-medium flex flex-col">
                      <span>No Unchecked Indexed Access</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        Prevents accessing array/object properties without checks
                      </span>
                    </Label>
                    <Switch 
                      id="no-unchecked"
                      checked={settings.typescript.noUncheckedIndexedAccess}
                      onCheckedChange={() => dispatch(toggleNoUncheckedIndexedAccess())}
                      data-testid="no-unchecked-switch"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="no-implicit" className="text-sm font-medium flex flex-col">
                      <span>No Implicit Override</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        Requires explicit override keyword for method overrides
                      </span>
                    </Label>
                    <Switch 
                      id="no-implicit"
                      checked={settings.typescript.noImplicitOverride}
                      onCheckedChange={() => dispatch(toggleNoImplicitOverride())}
                      data-testid="no-implicit-switch"
                    />
                  </div>
                </div>

                <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Settings className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div className="text-xs text-muted-foreground">
                      <p className="font-medium mb-1">Current Configuration:</p>
                      <ul className="space-y-1">
                        <li>Target: {settings.typescript.target.toUpperCase()}</li>
                        <li>Strict Mode: {settings.typescript.strict ? 'Enabled' : 'Disabled'}</li>
                        <li>Module: ESNext</li>
                        <li>Module Resolution: Node</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileType className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>TypeScript options are only available for TypeScript projects</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Validation Warnings */}
        {validation.warnings.length > 0 && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/10 dark:border-yellow-900/30">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 text-yellow-600 dark:text-yellow-400" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Configuration Warnings:</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                  {validation.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CodeQualityOptions;