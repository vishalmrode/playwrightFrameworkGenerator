/**
 * CIConfiguration.tsx
 * Purpose: UI for editing CI/CD pipeline configuration used by the generator.
 * Contains workflow management, per-workflow settings, and insights. This is
 * a visual component and dispatches updates to the ciPipeline slice.
 */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  GitBranch, 
  Settings, 
  Play, 
  Clock, 
  RefreshCcw, 
  Globe, 
  FileText, 
  Archive,
  Bell,
  Shield,
  Plus,
  Copy,
  Trash2,
  Info,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { 
  setCIEnabled,
  addWorkflow,
  updateWorkflow,
  removeWorkflow,
  selectWorkflow,
  duplicateWorkflow,
  resetCIPipelineConfig
} from "@/store/slices/ciPipelineSlice";
import { getCIPipelineDescription, getWorkflowComplexity, getWorkflowRecommendations } from "@/lib/ConfigureCIPipeline";
// DEFAULT_WORKFLOW_CONFIG not currently used in this component
import { TriggerConfiguration } from "./CIConfiguration/TriggerConfiguration";
import { ExecutionConfiguration } from "./CIConfiguration/ExecutionConfiguration";
import { EnvironmentConfiguration } from "./CIConfiguration/EnvironmentConfiguration";
import { ReportingConfiguration } from "./CIConfiguration/ReportingConfiguration";
import { ArtifactConfiguration } from "./CIConfiguration/ArtifactConfiguration";
import { NotificationConfiguration } from "./CIConfiguration/NotificationConfiguration";
import { SecurityConfiguration } from "./CIConfiguration/SecurityConfiguration";
import { GlobalSettingsConfiguration } from "./CIConfiguration/GlobalSettingsConfiguration";

export function CIConfiguration() {
  const dispatch = useAppDispatch();
  const { enabled, workflows, selectedWorkflowIndex, globalSettings } = useAppSelector(state => state.ciPipeline);
  const selectedWorkflow = workflows[selectedWorkflowIndex];
  const [isCreatingWorkflow, setIsCreatingWorkflow] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowDescription, setNewWorkflowDescription] = useState("");
  const [isResetOpen, setIsResetOpen] = useState(false);

  const handleToggleEnabled = (enabled: boolean) => {
    dispatch(setCIEnabled(enabled));
  };

  const handleCreateWorkflow = () => {
    if (newWorkflowName.trim()) {
      dispatch(addWorkflow({
        name: newWorkflowName.trim(),
        description: newWorkflowDescription.trim() || undefined,
      }));
      setNewWorkflowName("");
      setNewWorkflowDescription("");
      setIsCreatingWorkflow(false);
    }
  };

  const handleSelectWorkflow = (index: number) => {
    dispatch(selectWorkflow(index));
  };

  const handleDuplicateWorkflow = (index: number) => {
    dispatch(duplicateWorkflow(index));
  };

  const handleDeleteWorkflow = (index: number) => {
    if (workflows.length > 1) {
      dispatch(removeWorkflow(index));
    }
  };

  const handleUpdateWorkflowBasic = (name: string, description?: string) => {
    dispatch(updateWorkflow({
      index: selectedWorkflowIndex,
      workflow: { name, description }
    }));
  };

  const handleResetConfiguration = () => {
    dispatch(resetCIPipelineConfig());
  };

  const workflowComplexity = selectedWorkflow ? getWorkflowComplexity(selectedWorkflow) : 0;
  // mark as referenced to avoid TS6133 when conditionally used elsewhere
  void workflowComplexity;
  const workflowRecommendations = selectedWorkflow ? getWorkflowRecommendations(selectedWorkflow) : [];
  const pipelineDescription = getCIPipelineDescription({ enabled, workflows, selectedWorkflowIndex, globalSettings });

  return (
    <Card className="w-full min-w-0" data-testid="ci-configuration">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1 min-w-0">
            <CardTitle className="flex items-center gap-2 whitespace-nowrap">
              <GitBranch className="w-5 h-5" />
              CI/CD Pipeline Configuration
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {pipelineDescription}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={enabled ? "default" : "secondary"} className="flex items-center gap-1">
              {enabled ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Enabled
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3" />
                  Disabled
                </>
              )}
            </Badge>
            <Switch 
              checked={enabled}
              onCheckedChange={handleToggleEnabled}
              data-testid="ci-enabled-switch"
            />
          </div>
        </div>
      </CardHeader>

      {enabled && (
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column: workflow management + list (3/9 split) */}
            <div className="lg:col-span-3 space-y-4 relative z-40 pr-6 lg:pr-8">
              {/* Workflow Management */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Workflows</Label>
                    <p className="text-xs text-muted-foreground">
                      Manage your CI/CD workflow configurations
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsCreatingWorkflow(true)}
                          data-testid="add-workflow-button"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add New Workflow</TooltipContent>
                    </Tooltip>
                    
                    <Credenza open={isResetOpen} onOpenChange={setIsResetOpen}>
                      <CredenzaTrigger asChild>
                        <Button variant="outline" size="sm" data-testid="reset-config-trigger">
                          <RefreshCcw className="w-4 h-4" />
                        </Button>
                      </CredenzaTrigger>
                      <CredenzaContent className="z-50">
                        <CredenzaHeader>
                          <CredenzaTitle className="flex items-center gap-2">
                            <RefreshCcw className="w-4 h-4 text-destructive" />
                            Reset Configuration?
                          </CredenzaTitle>
                          <CredenzaDescription>
                            This will reset all CI/CD configuration to default values.
                          </CredenzaDescription>
                        </CredenzaHeader>
                        <CredenzaBody>
                          All custom workflows, settings, and configurations will be lost. 
                          This action cannot be undone.
                        </CredenzaBody>
                        <CredenzaFooter>
                          <CredenzaClose asChild>
                            <Button variant="secondary">Cancel</Button>
                          </CredenzaClose>
                          <CredenzaAction 
                            variant="destructive" 
                            onClick={() => { handleResetConfiguration(); setIsResetOpen(false); }}
                            data-testid="confirm-reset-config"
                          >
                            Reset Configuration
                          </CredenzaAction>
                        </CredenzaFooter>
                      </CredenzaContent>
                    </Credenza>
                  </div>
                </div>
              </div>

              {/* Workflow List */}
      <div className="grid gap-3">
                {workflows.map((workflow, index) => (
                  <Card 
                    key={workflow.id} 
        className={`cursor-pointer transition-colors overflow-visible relative z-40 ${
                      index === selectedWorkflowIndex 
                        ? 'ring-2 ring-ring bg-muted/50' 
                        : 'hover:bg-muted/30'
                    }`}
                    onClick={() => handleSelectWorkflow(index)}
                    data-testid={`workflow-item-${index}`}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{workflow.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            Complexity: {getWorkflowComplexity(workflow)}/10
                          </Badge>
                        </div>
                        {workflow.description && (
                          <p className="text-sm text-muted-foreground">
                            {workflow.description}
                          </p>
                        )}
                      </div>
                    </CardContent>

                    <div className="px-4 pb-4 pt-0 flex items-center gap-2 justify-end">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="relative z-50"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateWorkflow(index);
                            }}
                            data-testid={`duplicate-workflow-${index}`}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Duplicate Workflow</TooltipContent>
                      </Tooltip>

                      {workflows.length > 1 && (
                        <Credenza>
                          <CredenzaTrigger asChild>
                            <Button
                              className="relative z-50"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => e.stopPropagation()}
                              data-testid={`delete-workflow-trigger-${index}`}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </CredenzaTrigger>
                          <CredenzaContent>
                            <CredenzaHeader>
                              <CredenzaTitle className="flex items-center gap-2">
                                <Trash2 className="w-4 h-4 text-destructive" />
                                Delete Workflow?
                              </CredenzaTitle>
                              <CredenzaDescription>
                                Are you sure you want to delete "{workflow.name}"?
                              </CredenzaDescription>
                            </CredenzaHeader>
                            <CredenzaBody>
                              This action cannot be undone. The workflow configuration will be permanently removed.
                            </CredenzaBody>
                            <CredenzaFooter>
                              <CredenzaClose asChild>
                                <Button variant="secondary">Cancel</Button>
                              </CredenzaClose>
                              <CredenzaAction 
                                variant="destructive" 
                                onClick={() => handleDeleteWorkflow(index)}
                                data-testid={`confirm-delete-workflow-${index}`}
                              >
                                Delete Workflow
                              </CredenzaAction>
                            </CredenzaFooter>
                          </CredenzaContent>
                        </Credenza>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Create Workflow Dialog */}
              <Credenza open={isCreatingWorkflow} onOpenChange={setIsCreatingWorkflow}>
                <CredenzaContent>
                  <CredenzaHeader>
                    <CredenzaTitle>Create New Workflow</CredenzaTitle>
                    <CredenzaDescription>
                      Create a new CI/CD workflow configuration.
                    </CredenzaDescription>
                  </CredenzaHeader>
                  <CredenzaBody className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-workflow-name">Name</Label>
                      <Input
                        id="new-workflow-name"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                        placeholder="e.g., Production Tests, Nightly Build"
                        data-testid="new-workflow-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-workflow-description">Description (Optional)</Label>
                      <Textarea
                        id="new-workflow-description"
                        value={newWorkflowDescription}
                        onChange={(e) => setNewWorkflowDescription(e.target.value)}
                        placeholder="Describe what this workflow is for..."
                        rows={3}
                        data-testid="new-workflow-description-input"
                      />
                    </div>
                  </CredenzaBody>
                  <CredenzaFooter>
                    <CredenzaClose asChild>
                      <Button variant="secondary">Cancel</Button>
                    </CredenzaClose>
                    <CredenzaAction 
                      onClick={handleCreateWorkflow}
                      disabled={!newWorkflowName.trim()}
                      data-testid="create-workflow-confirm"
                    >
                      Create Workflow
                    </CredenzaAction>
                  </CredenzaFooter>
                </CredenzaContent>
              </Credenza>
            </div>

            {/* Right column: selected workflow details and tabs */}
            <div className="lg:col-span-9 space-y-6 relative z-20 pl-4 sm:pl-6 isolate overflow-hidden">
              {selectedWorkflow && (
                <>
                  {/* Workflow Basic Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <Label className="font-medium">Workflow Details</Label>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="workflow-name">Name</Label>
                        <Input
                          id="workflow-name"
                          value={selectedWorkflow.name}
                          onChange={(e) => handleUpdateWorkflowBasic(e.target.value, selectedWorkflow.description)}
                          placeholder="Workflow name"
                          data-testid="workflow-name-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="workflow-description">Description</Label>
                        <Input
                          id="workflow-description"
                          value={selectedWorkflow.description || ""}
                          onChange={(e) => handleUpdateWorkflowBasic(selectedWorkflow.name, e.target.value)}
                          placeholder="Optional description"
                          data-testid="workflow-description-input"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Workflow Configuration Tabs */}
                  <Tabs defaultValue="triggers" className="space-y-4">
                    {/* add spacing so tabs don't sit on top of header */}
                    <TabsList className="flex flex-wrap items-center gap-2 mb-3 relative z-20">
                  <TabsTrigger value="triggers" className="inline-flex items-center gap-2 px-3 py-1 rounded-md whitespace-nowrap bg-background shadow-sm">
                    <Play className="w-3 h-3" />
                    <span>Triggers</span>
                  </TabsTrigger>
                  <TabsTrigger value="execution" className="inline-flex items-center gap-2 px-3 py-1 rounded-md whitespace-nowrap bg-background shadow-sm">
                    <Clock className="w-3 h-3" />
                    <span>Execution</span>
                  </TabsTrigger>
                  <TabsTrigger value="environment" className="inline-flex items-center gap-2 px-3 py-1 rounded-md whitespace-nowrap bg-background shadow-sm">
                    <Globe className="w-3 h-3" />
                    <span>Environment</span>
                  </TabsTrigger>
                  <TabsTrigger value="reporting" className="inline-flex items-center gap-2 px-3 py-1 rounded-md whitespace-nowrap bg-background shadow-sm">
                    <FileText className="w-3 h-3" />
                    <span>Reporting</span>
                  </TabsTrigger>
                  <TabsTrigger value="artifacts" className="inline-flex items-center gap-2 px-3 py-1 rounded-md whitespace-nowrap bg-background shadow-sm">
                    <Archive className="w-3 h-3" />
                    <span>Artifacts</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="inline-flex items-center gap-2 px-3 py-1 rounded-md whitespace-nowrap bg-background shadow-sm">
                    <Bell className="w-3 h-3" />
                    <span>Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="inline-flex items-center gap-2 px-3 py-1 rounded-md whitespace-nowrap bg-background shadow-sm">
                    <Shield className="w-3 h-3" />
                    <span>Security</span>
                  </TabsTrigger>
                  <TabsTrigger value="global" className="inline-flex items-center gap-2 px-3 py-1 rounded-md whitespace-nowrap bg-background shadow-sm">
                    <Settings className="w-3 h-3" />
                    <span>Global</span>
                  </TabsTrigger>
                </TabsList>

                    <TabsContent value="triggers" className="space-y-4">
                      <TriggerConfiguration />
                    </TabsContent>

                    <TabsContent value="execution" className="space-y-4">
                      <ExecutionConfiguration />
                    </TabsContent>

                    <TabsContent value="environment" className="space-y-4">
                      <EnvironmentConfiguration />
                    </TabsContent>

                    <TabsContent value="reporting" className="space-y-4">
                      <ReportingConfiguration />
                    </TabsContent>

                    <TabsContent value="artifacts" className="space-y-4">
                      <ArtifactConfiguration />
                    </TabsContent>

                    <TabsContent value="notifications" className="space-y-4">
                      <NotificationConfiguration />
                    </TabsContent>

                    <TabsContent value="security" className="space-y-4">
                      <SecurityConfiguration />
                    </TabsContent>

                    <TabsContent value="global" className="space-y-4">
                      <GlobalSettingsConfiguration />
                    </TabsContent>
                  </Tabs>

                  {/* Workflow Insights */}
                  {workflowRecommendations.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-blue-500" />
                          <Label className="font-medium">Recommendations</Label>
                        </div>
                        <div className="space-y-2">
                          {workflowRecommendations.map((recommendation, index) => (
                            <div 
                              key={index}
                              className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800"
                            >
                              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                {recommendation}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default CIConfiguration;