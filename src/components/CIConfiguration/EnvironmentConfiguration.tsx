import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Laptop, Monitor, Smartphone, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateWorkflowEnvironments } from "@/store/slices/ciPipelineSlice";
import { NODE_VERSIONS, OPERATING_SYSTEMS, BROWSERS } from "@/types/ciPipeline";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useState } from "react";

export function EnvironmentConfiguration() {
  const dispatch = useAppDispatch();
  const { selectedWorkflowIndex, workflows } = useAppSelector(state => state.ciPipeline);
  const workflow = workflows[selectedWorkflowIndex];
  const [newVariableName, setNewVariableName] = useState("");
  const [newVariableValues, setNewVariableValues] = useState("");

  if (!workflow) return null;

  const { environments } = workflow;

  const handleUpdateEnvironments = (updates: any) => {
    dispatch(updateWorkflowEnvironments({
      index: selectedWorkflowIndex,
      environments: updates
    }));
  };

  const handleNodeVersionsChange = (version: string, checked: boolean) => {
    const versions = checked 
      ? [...environments.nodeVersions, version]
      : environments.nodeVersions.filter(v => v !== version);
    handleUpdateEnvironments({ nodeVersions: versions });
  };

  const handleOperatingSystemsChange = (os: string, checked: boolean) => {
    const systems = checked 
      ? [...environments.operatingSystems, os]
      : environments.operatingSystems.filter(s => s !== os);
    handleUpdateEnvironments({ operatingSystems: systems });
  };

  const handleBrowsersChange = (browser: string, checked: boolean) => {
    const browsers = checked 
      ? [...environments.browsers, browser]
      : environments.browsers.filter(b => b !== browser);
    handleUpdateEnvironments({ browsers });
  };

  const handleAddCustomVariable = () => {
    if (newVariableName.trim() && newVariableValues.trim()) {
      const values = newVariableValues.split(',').map(v => v.trim()).filter(Boolean);
      const customVariables = {
        ...environments.customVariables,
        [newVariableName.trim()]: values
      };
      handleUpdateEnvironments({ customVariables });
      setNewVariableName("");
      setNewVariableValues("");
    }
  };

  const handleRemoveCustomVariable = (name: string) => {
    const customVariables = { ...environments.customVariables };
    delete customVariables[name];
    handleUpdateEnvironments({ customVariables });
  };

  const totalCombinations = 
    environments.nodeVersions.length * 
    environments.operatingSystems.length * 
    environments.browsers.length *
    Object.values(environments.customVariables || {}).reduce((acc, values) => acc * values.length, 1);

  const getOSIcon = (os: string) => {
    if (os.includes('windows')) return <Monitor className="w-4 h-4" />;
    if (os.includes('macos')) return <Laptop className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6 w-full" data-testid="environment-configuration">
      <div className="flex items-center justify-between">
        <div className="space-y-1 min-w-0">
          <h3 className="text-lg font-semibold flex items-center gap-2 whitespace-nowrap">
            <Globe className="w-5 h-5" />
            Environment Matrix
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure the environments to test against
          </p>
        </div>
        <Badge variant={totalCombinations > 10 ? "destructive" : totalCombinations > 5 ? "secondary" : "default"} className="whitespace-nowrap ml-4">
          {totalCombinations} combination{totalCombinations !== 1 ? 's' : ''}
        </Badge>
      </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Node.js Versions */}
        <Card className="w-full min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
              Node.js Versions
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 cursor-help text-muted-foreground">?</span>
                </TooltipTrigger>
                <TooltipContent>Select which Node.js versions to test your project against in CI. Newer versions may have breaking changes.</TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {NODE_VERSIONS.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`node-${value}`}
                    checked={environments.nodeVersions.includes(value)}
                    onCheckedChange={(checked) => handleNodeVersionsChange(value, checked as boolean)}
                    data-testid={`node-version-${value}`}
                  />
                  <Label htmlFor={`node-${value}`} className="text-sm">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{label}</span>
                      </TooltipTrigger>
                      <TooltipContent>Enable testing on Node.js {label.replace(/[^0-9]+/g, '')}</TooltipContent>
                    </Tooltip>
                  </Label>
                </div>
              ))}
            </div>
            {environments.nodeVersions.length === 0 && (
              <p className="text-sm text-destructive mt-3">
                At least one Node.js version must be selected
              </p>
            )}
          </CardContent>
        </Card>

        {/* Operating Systems */}
        <Card className="w-full min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Operating Systems
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 cursor-help text-muted-foreground">?</span>
                </TooltipTrigger>
                <TooltipContent>Select which operating systems to run your tests on. Useful for cross-platform compatibility.</TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {OPERATING_SYSTEMS.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-3">
                  <Checkbox
                    id={`os-${value}`}
                    checked={environments.operatingSystems.includes(value)}
                    onCheckedChange={(checked) => handleOperatingSystemsChange(value, checked as boolean)}
                    data-testid={`os-${value}`}
                  />
                  <div className="flex items-center space-x-2">
                    {getOSIcon(value)}
                    <Label htmlFor={`os-${value}`} className="text-sm">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{label}</span>
                        </TooltipTrigger>
                        <TooltipContent>Enable testing on {label}</TooltipContent>
                      </Tooltip>
                    </Label>
                  </div>
                </div>
              ))}
            </div>
            {environments.operatingSystems.length === 0 && (
              <p className="text-sm text-destructive mt-3">
                At least one operating system must be selected
              </p>
            )}
          </CardContent>
        </Card>

        {/* Browsers */}
        <Card className="w-full min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Browsers
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 cursor-help text-muted-foreground">?</span>
                </TooltipTrigger>
                <TooltipContent>Select browsers for end-to-end testing. Ensures your app works across all major browsers.</TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BROWSERS.map(({ value, label }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`browser-${value}`}
                    checked={environments.browsers.includes(value)}
                    onCheckedChange={(checked) => handleBrowsersChange(value, checked as boolean)}
                    data-testid={`browser-${value}`}
                  />
                  <Label htmlFor={`browser-${value}`} className="text-sm">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{label}</span>
                      </TooltipTrigger>
                      <TooltipContent>Enable testing on {label}</TooltipContent>
                    </Tooltip>
                  </Label>
                </div>
              ))}
            </div>
            {environments.browsers.length === 0 && (
              <p className="text-sm text-destructive mt-3">
                At least one browser must be selected
              </p>
            )}
          </CardContent>
        </Card>

        {/* Custom Variables */}
        <Card className="w-full min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Custom Environment Variables
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="ml-1 cursor-help text-muted-foreground">?</span>
                </TooltipTrigger>
                <TooltipContent>Define custom environment variables for your CI jobs. Useful for secrets, feature flags, etc.</TooltipContent>
              </Tooltip>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Variables */}
            {environments.customVariables && Object.keys(environments.customVariables).length > 0 && (
              <div className="space-y-3">
                {Object.entries(environments.customVariables).map(([name, values]) => (
                  <div key={name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{name}</div>
                      <div className="text-sm text-muted-foreground">
                        {values.join(', ')}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCustomVariable(name)}
                      data-testid={`remove-custom-variable-${name}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Variable */}
            <div className="space-y-3 p-3 border border-dashed border-border rounded-lg">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="custom-var-name">
                    Variable Name
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-1 cursor-help text-muted-foreground">?</span>
                      </TooltipTrigger>
                      <TooltipContent>Name of the environment variable (e.g., DATABASE_TYPE).</TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="custom-var-name"
                    value={newVariableName}
                    onChange={(e) => setNewVariableName(e.target.value)}
                    placeholder="e.g., DATABASE_TYPE"
                    data-testid="custom-variable-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-var-values">
                    Values (comma-separated)
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="ml-1 cursor-help text-muted-foreground">?</span>
                      </TooltipTrigger>
                      <TooltipContent>Comma-separated values for this variable (e.g., mysql, postgres, sqlite).</TooltipContent>
                    </Tooltip>
                  </Label>
                  <Input
                    id="custom-var-values"
                    value={newVariableValues}
                    onChange={(e) => setNewVariableValues(e.target.value)}
                    placeholder="e.g., mysql, postgres, sqlite"
                    data-testid="custom-variable-values-input"
                  />
                </div>
              </div>
              <Button
                onClick={handleAddCustomVariable}
                disabled={!newVariableName.trim() || !newVariableValues.trim()}
                size="sm"
                data-testid="add-custom-variable-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Variable
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Custom variables will be available as environment variables in your workflow.
            </p>
          </CardContent>
        </Card>

        {/* Matrix Summary */}
        {totalCombinations > 0 && (
          <Card className={`w-full min-w-0 ${totalCombinations > 10 ? 'border-destructive' : ''}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Matrix Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Node.js</div>
                    <div className="text-muted-foreground">{environments.nodeVersions.length} versions</div>
                  </div>
                  <div>
                    <div className="font-medium">OS</div>
                    <div className="text-muted-foreground">{environments.operatingSystems.length} systems</div>
                  </div>
                  <div>
                    <div className="font-medium">Browsers</div>
                    <div className="text-muted-foreground">{environments.browsers.length} browsers</div>
                  </div>
                  <div>
                    <div className="font-medium">Custom</div>
                    <div className="text-muted-foreground">
                      {Object.keys(environments.customVariables || {}).length} variables
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="font-medium">Total Combinations:</div>
                  <Badge variant={totalCombinations > 10 ? "destructive" : totalCombinations > 5 ? "secondary" : "default"}>
                    {totalCombinations}
                  </Badge>
                </div>

                {totalCombinations > 10 && (
                  <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                    Warning: Large matrix detected. Consider reducing combinations to avoid excessive CI costs and long build times.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default EnvironmentConfiguration;