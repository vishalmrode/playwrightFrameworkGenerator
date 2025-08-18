import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
  CredenzaTrigger,
  CredenzaAction,
} from "@/components/ui/credenza";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  Plus, 
  Settings, 
  Trash, 
  AlertTriangle, 
  Globe, 
  Clock, 
  RotateCcw,
  Eye,
  Camera,
  Video
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { 
  addEnvironment, 
  updateEnvironment, 
  removeEnvironment, 
  resetEnvironments,
  toggleEnvironmentSelection,
} from "@/store/slices/environmentSlice";
import { EnvironmentConfig } from '@/types/environment';
import { 
  validateEnvironmentSettings, 
  getEnvironmentSettingsDescription,
  validateEnvironmentConfig,
  getDefaultEnvironmentConfig
} from '@/lib/ConfigureEnvironmentSettings';

interface EnvironmentFormProps {
  environment: EnvironmentConfig;
  onChange: (environment: EnvironmentConfig) => void;
  errors?: string[];
}

function EnvironmentForm({ environment, onChange, errors = [] }: EnvironmentFormProps) {
  const updateField = (field: keyof EnvironmentConfig, value: any) => {
    onChange({ ...environment, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="env-name">Environment Name *</Label>
          <Input
            id="env-name"
            value={environment.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g., development, staging, production"
            data-testid="environment-name-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="base-url">Base URL *</Label>
          <Input
            id="base-url"
            value={environment.baseUrl}
            onChange={(e) => updateField('baseUrl', e.target.value)}
            placeholder="e.g., https://example.com"
            data-testid="environment-base-url-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeout">Timeout (ms)</Label>
          <Input
            id="timeout"
            type="number"
            value={environment.timeout || 30000}
            onChange={(e) => updateField('timeout', parseInt(e.target.value) || 30000)}
            min={1000}
            max={300000}
            data-testid="environment-timeout-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="retries">Retries</Label>
          <Input
            id="retries"
            type="number"
            value={environment.retries || 1}
            onChange={(e) => updateField('retries', parseInt(e.target.value) || 1)}
            min={0}
            max={10}
            data-testid="environment-retries-input"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="headless">Headless Mode</Label>
            <p className="text-sm text-muted-foreground">Run browsers without a graphical interface</p>
          </div>
          <Switch
            id="headless"
            checked={environment.headless ?? true}
            onCheckedChange={(checked) => updateField('headless', checked)}
            data-testid="environment-headless-switch"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenshot">Screenshot Mode</Label>
          <Select
            value={environment.screenshot || 'only-on-failure'}
            onValueChange={(value) => updateField('screenshot', value)}
          >
            <SelectTrigger data-testid="environment-screenshot-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Off</SelectItem>
              <SelectItem value="only-on-failure">Only on Failure</SelectItem>
              <SelectItem value="on">Always On</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="video">Video Recording</Label>
          <Select
            value={environment.video || 'retain-on-failure'}
            onValueChange={(value) => updateField('video', value)}
          >
            <SelectTrigger data-testid="environment-video-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">Off</SelectItem>
              <SelectItem value="on-first-retry">On First Retry</SelectItem>
              <SelectItem value="retain-on-failure">Retain on Failure</SelectItem>
              <SelectItem value="on">Always On</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-destructive">{error}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteEnvironmentButton({ 
  environmentName, 
  onDelete 
}: { 
  environmentName: string; 
  onDelete: () => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Credenza>
          <CredenzaTrigger asChild>
            <Button variant="ghost" size="icon" data-testid={`delete-environment-${environmentName}`}>
              <Trash className="w-4 h-4 text-destructive" />
            </Button>
          </CredenzaTrigger>
          <CredenzaContent>
            <CredenzaHeader>
              <CredenzaTitle>
                <Trash className="w-4 h-4 text-destructive mr-2" />
                Delete Environment
              </CredenzaTitle>
              <CredenzaDescription>
                Are you sure you want to delete the "{environmentName}" environment?
              </CredenzaDescription>
            </CredenzaHeader>
            <CredenzaBody>
              This action cannot be undone. All configuration for this environment will be permanently removed.
            </CredenzaBody>
            <CredenzaFooter>
              <CredenzaClose asChild>
                <Button variant="secondary">Cancel</Button>
              </CredenzaClose>
              <CredenzaAction variant="destructive" onClick={onDelete}>
                Delete Environment
              </CredenzaAction>
            </CredenzaFooter>
          </CredenzaContent>
        </Credenza>
      </TooltipTrigger>
      <TooltipContent>
        Delete environment
      </TooltipContent>
    </Tooltip>
  );
}

export function EnvironmentSettings() {
  const dispatch = useAppDispatch();
  const environmentState = useAppSelector((state) => state.environment);
  const [editingEnvironment, setEditingEnvironment] = useState<EnvironmentConfig | null>(null);
  const [editingIndex, setEditingIndex] = useState<number>(-1);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'environments' | 'settings'>('environments');

  const isValid = validateEnvironmentSettings(environmentState);
  const description = getEnvironmentSettingsDescription(environmentState);

  const handleToggleSelectEnvironment = (environmentName: string) => {
    dispatch(toggleEnvironmentSelection(environmentName));
  };

  const handleAddEnvironment = () => {
    const newEnvironment = getDefaultEnvironmentConfig();
    setEditingEnvironment(newEnvironment);
    setEditingIndex(-1);
    setFormErrors([]);
  setActiveTab('settings');
  };

  const handleEditEnvironment = (index: number) => {
    setEditingEnvironment({ ...environmentState.environments[index] });
    setEditingIndex(index);
    setFormErrors([]);
  setActiveTab('settings');
  };

  const handleSaveEnvironment = () => {
    if (!editingEnvironment) return;

    const validation = validateEnvironmentConfig(editingEnvironment);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }

    // Check for duplicate names (excluding the current environment being edited)
    const existingNames = environmentState.environments
      .filter((_, index) => index !== editingIndex)
      .map(env => env.name);
    
    if (existingNames.includes(editingEnvironment.name)) {
      setFormErrors(['An environment with this name already exists']);
      return;
    }

    if (editingIndex >= 0) {
      dispatch(updateEnvironment({ index: editingIndex, environment: editingEnvironment }));
    } else {
      dispatch(addEnvironment(editingEnvironment));
    }

    setEditingEnvironment(null);
    setEditingIndex(-1);
    setFormErrors([]);
  setActiveTab('environments');
  };

  const handleDeleteEnvironment = (index: number) => {
    dispatch(removeEnvironment(index));
  };

  const handleResetEnvironments = () => {
    dispatch(resetEnvironments());
  };

  const cancelEditing = () => {
    setEditingEnvironment(null);
    setEditingIndex(-1);
    setFormErrors([]);
  setActiveTab('environments');
  };

  return (
    <Card data-testid="environment-settings">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Environment Settings
          {!isValid && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Invalid
            </Badge>
          )}
        </CardTitle>
        <CardDescription data-testid="environment-settings-description">
          Configure multiple testing environments with custom settings. {description}.
        </CardDescription>
      </CardHeader>
      <CardContent>
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'environments' | 'settings')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="environments">Environments</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="environments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Available Environments</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResetEnvironments}
                  data-testid="reset-environments-button"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddEnvironment}
                  data-testid="add-environment-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Environment
                </Button>
              </div>
            </div>

            {environmentState.environments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No environments configured</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={handleAddEnvironment}
                >
                  Add Your First Environment
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {environmentState.environments.map((env, index) => (
                  <div key={`${env.name}-${index}`} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{env.name}</h4>
                        {environmentState.selectedEnvironments.includes(env.name) && (
                          <Badge variant="secondary" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          <span>{env.baseUrl}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{env.timeout || 30000}ms</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            <span>{env.retries || 1} retries</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{env.headless ? 'Headless' : 'Headed'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            <span>{env.screenshot}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            <span>{env.video}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={environmentState.selectedEnvironments.includes(env.name)}
                            onCheckedChange={() => handleToggleSelectEnvironment(env.name)}
                            aria-label={`select-environment-${env.name}`}
                            data-testid={`checkbox-select-environment-${env.name}`}
                          />
                          <span className="text-sm">Select</span>
                        </label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditEnvironment(index)}
                        data-testid={`edit-environment-${env.name}`}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      {environmentState.environments.length > 1 && (
                        <DeleteEnvironmentButton
                          environmentName={env.name}
                          onDelete={() => handleDeleteEnvironment(index)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isValid && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">At least one valid environment must be configured</span>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            {editingEnvironment ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">
                    {editingIndex >= 0 ? 'Edit Environment' : 'Add New Environment'}
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveEnvironment} data-testid="save-environment-button">
                      Save Environment
                    </Button>
                  </div>
                </div>
                <EnvironmentForm
                  environment={editingEnvironment}
                  onChange={setEditingEnvironment}
                  errors={formErrors}
                />
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select an environment to edit or add a new one</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={handleAddEnvironment}
                >
                  Add Environment
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default EnvironmentSettings;