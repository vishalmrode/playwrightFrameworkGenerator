import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Archive, Camera, Video, Activity, FileText, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateWorkflowArtifacts } from "@/store/slices/ciPipelineSlice";
import { useState } from "react";

export function ArtifactConfiguration() {
  const dispatch = useAppDispatch();
  const { selectedWorkflowIndex, workflows } = useAppSelector(state => state.ciPipeline);
  const workflow = workflows[selectedWorkflowIndex];
  const [newArtifactName, setNewArtifactName] = useState("");
  const [newArtifactPath, setNewArtifactPath] = useState("");
  const [newArtifactCondition, setNewArtifactCondition] = useState<"always" | "on-success" | "on-failure">("always");
  const [newArtifactRetention, setNewArtifactRetention] = useState(30);

  if (!workflow) return null;

  const { artifacts } = workflow;

  const handleUpdateArtifacts = (updates: any) => {
    dispatch(updateWorkflowArtifacts({
      index: selectedWorkflowIndex,
      artifacts: updates
    }));
  };

  const handleAddCustomArtifact = () => {
    if (newArtifactName.trim() && newArtifactPath.trim()) {
      const customArtifacts = [
        ...artifacts.customArtifacts,
        {
          name: newArtifactName.trim(),
          path: newArtifactPath.trim(),
          retention: newArtifactRetention,
          condition: newArtifactCondition
        }
      ];
      handleUpdateArtifacts({ customArtifacts });
      setNewArtifactName("");
      setNewArtifactPath("");
      setNewArtifactRetention(30);
      setNewArtifactCondition("always");
    }
  };

  const handleRemoveCustomArtifact = (index: number) => {
    const customArtifacts = artifacts.customArtifacts.filter((_, i) => i !== index);
    handleUpdateArtifacts({ customArtifacts });
  };

  const enabledArtifactsCount = [
    artifacts.screenshots.enabled,
    artifacts.videos.enabled,
    artifacts.traces.enabled,
    artifacts.logs.enabled,
    artifacts.testResults.enabled
  ].filter(Boolean).length + artifacts.customArtifacts.length;

  const getRetentionDisplay = (days: number) => {
    if (days === 1) return "1 day";
    if (days < 30) return `${days} days`;
    if (days === 30) return "1 month";
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''}`;
  };

  const getTotalStorageCost = () => {
    const baseStorage = [
      artifacts.screenshots.enabled ? artifacts.screenshots.retention * 0.1 : 0,
      artifacts.videos.enabled ? artifacts.videos.retention * 0.5 : 0,
      artifacts.traces.enabled ? artifacts.traces.retention * 0.2 : 0,
      artifacts.logs.enabled ? artifacts.logs.retention * 0.05 : 0,
      artifacts.testResults.enabled ? artifacts.testResults.retention * 0.02 : 0,
    ].reduce((a, b) => a + b, 0);
    
    const customStorage = artifacts.customArtifacts.reduce((acc, artifact) => 
      acc + (artifact.retention * 0.1), 0);
    
    return Math.round((baseStorage + customStorage) * 100) / 100;
  };

  return (
    <div className="space-y-6 w-full" data-testid="artifact-configuration">
      <div className="flex items-center justify-between">
        <div className="space-y-1 min-w-0">
          <h3 className="text-lg font-semibold flex items-center gap-2 whitespace-nowrap">
            <Archive className="w-5 h-5" />
            Artifact Storage
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure what artifacts to store from test runs
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Badge variant={enabledArtifactsCount > 0 ? "default" : "secondary"} className="whitespace-nowrap">
            {enabledArtifactsCount} artifact{enabledArtifactsCount !== 1 ? 's' : ''}
          </Badge>
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            ~${getTotalStorageCost()}/month
          </Badge>
        </div>
      </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Screenshots */}
        <Card className="w-full min-w-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Screenshots
              </div>
              <Switch
                checked={artifacts.screenshots.enabled}
                onCheckedChange={(enabled) => handleUpdateArtifacts({
                  screenshots: { ...artifacts.screenshots, enabled }
                })}
                data-testid="screenshots-enabled"
              />
            </CardTitle>
          </CardHeader>
          {artifacts.screenshots.enabled && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Only on Failure</Label>
                  <p className="text-xs text-muted-foreground">
                    Capture screenshots only when tests fail
                  </p>
                </div>
                <Switch
                  checked={artifacts.screenshots.onFailureOnly}
                  onCheckedChange={(onFailureOnly) => handleUpdateArtifacts({
                    screenshots: { ...artifacts.screenshots, onFailureOnly }
                  })}
                  data-testid="screenshots-failure-only"
                />
              </div>

              <div className="space-y-3">
                <Label>Retention: {getRetentionDisplay(artifacts.screenshots.retention)}</Label>
                <Slider
                  value={[artifacts.screenshots.retention]}
                  onValueChange={([retention]) => handleUpdateArtifacts({
                    screenshots: { ...artifacts.screenshots, retention }
                  })}
                  max={365}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="screenshots-retention-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 day</span>
                  <span>1 year</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Videos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos
              </div>
              <Switch
                checked={artifacts.videos.enabled}
                onCheckedChange={(enabled) => handleUpdateArtifacts({
                  videos: { ...artifacts.videos, enabled }
                })}
                data-testid="videos-enabled"
              />
            </CardTitle>
          </CardHeader>
          {artifacts.videos.enabled && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Only on Failure</Label>
                  <p className="text-xs text-muted-foreground">
                    Record videos only when tests fail
                  </p>
                </div>
                <Switch
                  checked={artifacts.videos.onFailureOnly}
                  onCheckedChange={(onFailureOnly) => handleUpdateArtifacts({
                    videos: { ...artifacts.videos, onFailureOnly }
                  })}
                  data-testid="videos-failure-only"
                />
              </div>

              <div className="space-y-3">
                <Label>Retention: {getRetentionDisplay(artifacts.videos.retention)}</Label>
                <Slider
                  value={[artifacts.videos.retention]}
                  onValueChange={([retention]) => handleUpdateArtifacts({
                    videos: { ...artifacts.videos, retention }
                  })}
                  max={365}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="videos-retention-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 day</span>
                  <span>1 year</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Traces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Playwright Traces
              </div>
              <Switch
                checked={artifacts.traces.enabled}
                onCheckedChange={(enabled) => handleUpdateArtifacts({
                  traces: { ...artifacts.traces, enabled }
                })}
                data-testid="traces-enabled"
              />
            </CardTitle>
          </CardHeader>
          {artifacts.traces.enabled && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Only on Failure</Label>
                  <p className="text-xs text-muted-foreground">
                    Generate traces only when tests fail
                  </p>
                </div>
                <Switch
                  checked={artifacts.traces.onFailureOnly}
                  onCheckedChange={(onFailureOnly) => handleUpdateArtifacts({
                    traces: { ...artifacts.traces, onFailureOnly }
                  })}
                  data-testid="traces-failure-only"
                />
              </div>

              <div className="space-y-3">
                <Label>Retention: {getRetentionDisplay(artifacts.traces.retention)}</Label>
                <Slider
                  value={[artifacts.traces.retention]}
                  onValueChange={([retention]) => handleUpdateArtifacts({
                    traces: { ...artifacts.traces, retention }
                  })}
                  max={365}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="traces-retention-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 day</span>
                  <span>1 year</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Test Logs
              </div>
              <Switch
                checked={artifacts.logs.enabled}
                onCheckedChange={(enabled) => handleUpdateArtifacts({
                  logs: { ...artifacts.logs, enabled }
                })}
                data-testid="logs-enabled"
              />
            </CardTitle>
          </CardHeader>
          {artifacts.logs.enabled && (
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Retention: {getRetentionDisplay(artifacts.logs.retention)}</Label>
                <Slider
                  value={[artifacts.logs.retention]}
                  onValueChange={([retention]) => handleUpdateArtifacts({
                    logs: { ...artifacts.logs, retention }
                  })}
                  max={365}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="logs-retention-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 day</span>
                  <span>1 year</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="w-4 h-4" />
                Test Results
              </div>
              <Switch
                checked={artifacts.testResults.enabled}
                onCheckedChange={(enabled) => handleUpdateArtifacts({
                  testResults: { ...artifacts.testResults, enabled }
                })}
                data-testid="test-results-enabled"
              />
            </CardTitle>
          </CardHeader>
          {artifacts.testResults.enabled && (
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Retention: {getRetentionDisplay(artifacts.testResults.retention)}</Label>
                <Slider
                  value={[artifacts.testResults.retention]}
                  onValueChange={([retention]) => handleUpdateArtifacts({
                    testResults: { ...artifacts.testResults, retention }
                  })}
                  max={365}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="test-results-retention-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 day</span>
                  <span>1 year</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Custom Artifacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Custom Artifacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Custom Artifacts */}
            {artifacts.customArtifacts.length > 0 && (
              <div className="space-y-3">
                {artifacts.customArtifacts.map((artifact, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{artifact.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {artifact.condition}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Path: {artifact.path}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Retention: {getRetentionDisplay(artifact.retention)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCustomArtifact(index)}
                      data-testid={`remove-custom-artifact-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Custom Artifact */}
            <div className="space-y-3 p-3 border border-dashed border-border rounded-lg">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="custom-artifact-name">Artifact Name</Label>
                  <Input
                    id="custom-artifact-name"
                    value={newArtifactName}
                    onChange={(e) => setNewArtifactName(e.target.value)}
                    placeholder="e.g., Performance Reports"
                    data-testid="custom-artifact-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-artifact-path">File Path/Pattern</Label>
                  <Input
                    id="custom-artifact-path"
                    value={newArtifactPath}
                    onChange={(e) => setNewArtifactPath(e.target.value)}
                    placeholder="e.g., reports/**, *.log"
                    data-testid="custom-artifact-path-input"
                  />
                </div>
              </div>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="custom-artifact-condition">Upload Condition</Label>
                  <Select
                    value={newArtifactCondition}
                    onValueChange={(value: any) => setNewArtifactCondition(value)}
                  >
                    <SelectTrigger data-testid="custom-artifact-condition-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="always">Always</SelectItem>
                      <SelectItem value="on-success">On Success Only</SelectItem>
                      <SelectItem value="on-failure">On Failure Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Retention: {getRetentionDisplay(newArtifactRetention)}</Label>
                  <Slider
                    value={[newArtifactRetention]}
                    onValueChange={([retention]) => setNewArtifactRetention(retention)}
                    max={365}
                    min={1}
                    step={1}
                    className="w-full"
                    data-testid="custom-artifact-retention-slider"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddCustomArtifact}
                disabled={!newArtifactName.trim() || !newArtifactPath.trim()}
                size="sm"
                data-testid="add-custom-artifact-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Artifact
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Custom artifacts will be uploaded to GitHub Actions artifacts storage with the specified conditions.
            </p>
          </CardContent>
        </Card>

        {/* Storage Summary */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Archive className="w-4 h-4" />
              Storage Cost Estimation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p>Estimated monthly storage cost: <strong className="text-foreground">${getTotalStorageCost()}</strong></p>
              <p className="text-xs mt-1">
                This is a rough estimate based on typical artifact sizes. Actual costs may vary.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ArtifactConfiguration;