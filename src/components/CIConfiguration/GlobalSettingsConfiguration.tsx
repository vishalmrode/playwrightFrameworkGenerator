import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Settings, Clock, Shield, Bug, Globe } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateGlobalSettings } from "@/store/slices/ciPipelineSlice";

export function GlobalSettingsConfiguration() {
  const dispatch = useAppDispatch();
  const { globalSettings } = useAppSelector(state => state.ciPipeline);

  const handleUpdateGlobalSettings = (updates: any) => {
    dispatch(updateGlobalSettings(updates));
  };

  const getTimeoutDisplay = (minutes: number) => {
    if (minutes < 60) return `${minutes} minutes`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  const getPermissionLevel = () => {
    return globalSettings.workflowPermissions === 'restricted' ? 'Restricted' : 'Permissive';
  };

  const getPermissionDescription = () => {
    return globalSettings.workflowPermissions === 'restricted' 
      ? 'Minimal permissions for security'
      : 'Broader permissions for flexibility';
  };

  return (
    <div className="space-y-6" data-testid="global-settings-configuration">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Global Settings
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure global CI/CD pipeline settings
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="w-3 h-3" />
          {getPermissionLevel()}
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Timeout Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeout Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Default Workflow Timeout: {getTimeoutDisplay(globalSettings.defaultTimeout)}</Label>
              <Slider
                value={[globalSettings.defaultTimeout]}
                onValueChange={([defaultTimeout]) => handleUpdateGlobalSettings({ defaultTimeout })}
                max={360}
                min={5}
                step={5}
                className="w-full"
                data-testid="default-timeout-slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 minutes</span>
                <span>6 hours</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum time a workflow can run before being automatically cancelled. 
                Individual workflows can override this setting.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Concurrency Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Concurrency Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="concurrency-group">Concurrency Group</Label>
              <Input
                id="concurrency-group"
                value={globalSettings.concurrencyGroup}
                onChange={(e) => handleUpdateGlobalSettings({ concurrencyGroup: e.target.value })}
                placeholder="ci-${{ github.ref }}"
                data-testid="concurrency-group-input"
              />
              <p className="text-xs text-muted-foreground">
                Workflows with the same concurrency group will be queued and only one will run at a time.
                Use GitHub expressions like ${"{{ github.ref }}"} for dynamic grouping.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Cancel In-Progress Workflows</Label>
                <p className="text-xs text-muted-foreground">
                  Cancel running workflows when a new one starts in the same concurrency group
                </p>
              </div>
              <Switch
                checked={globalSettings.cancelInProgress}
                onCheckedChange={(cancelInProgress) => handleUpdateGlobalSettings({ cancelInProgress })}
                data-testid="cancel-in-progress-switch"
              />
            </div>
          </CardContent>
        </Card>

        {/* Permission Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Workflow Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Permission Level</Label>
              <Select
                value={globalSettings.workflowPermissions}
                onValueChange={(workflowPermissions: 'restricted' | 'permissive') => 
                  handleUpdateGlobalSettings({ workflowPermissions })
                }
                data-testid="workflow-permissions-select"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="restricted">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        <span>Restricted</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Minimal permissions for better security
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="permissive">
                    <div className="flex flex-col items-start">
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <span>Permissive</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Broader permissions for more flexibility
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {getPermissionDescription()}. Individual workflows can override these settings.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Debugging Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Debugging & Logging
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Debug Logging</Label>
                <p className="text-xs text-muted-foreground">
                  Add detailed debugging information to workflow logs
                </p>
              </div>
              <Switch
                checked={globalSettings.enableDebugLogging}
                onCheckedChange={(enableDebugLogging) => handleUpdateGlobalSettings({ enableDebugLogging })}
                data-testid="debug-logging-switch"
              />
            </div>

            {globalSettings.enableDebugLogging && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-2">
                  <Bug className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <strong>Debug mode enabled:</strong> This will add verbose logging to your workflows, 
                    which can help with troubleshooting but may make logs more difficult to read and increase storage costs.
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings Summary */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Settings className="w-4 h-4" />
              Configuration Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Default timeout:</span>
                <span className="font-medium">{getTimeoutDisplay(globalSettings.defaultTimeout)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Concurrency group:</span>
                <Badge variant="outline" className="text-xs">
                  {globalSettings.concurrencyGroup}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cancel in progress:</span>
                <Badge variant={globalSettings.cancelInProgress ? "default" : "secondary"} className="text-xs">
                  {globalSettings.cancelInProgress ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Permission level:</span>
                <Badge 
                  variant={globalSettings.workflowPermissions === 'restricted' ? "default" : "secondary"} 
                  className="text-xs"
                >
                  {getPermissionLevel()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Debug logging:</span>
                <Badge variant={globalSettings.enableDebugLogging ? "default" : "secondary"} className="text-xs">
                  {globalSettings.enableDebugLogging ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Practices */}
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Settings className="w-4 h-4" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 dark:text-blue-300">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Timeout:</strong> Set reasonable timeouts to prevent workflows from running indefinitely. 
                Most test suites should complete within 30 minutes.
              </li>
              <li>
                <strong>Concurrency:</strong> Use concurrency groups to prevent resource conflicts and save on CI costs.
              </li>
              <li>
                <strong>Permissions:</strong> Start with restricted permissions and only grant additional access as needed.
              </li>
              <li>
                <strong>Debug Logging:</strong> Only enable when troubleshooting to avoid log noise and storage costs.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default GlobalSettingsConfiguration;