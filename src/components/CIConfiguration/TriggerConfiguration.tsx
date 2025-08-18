import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { GitBranch, GitPullRequest, Clock, Play, Tag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateWorkflowTriggers } from "@/store/slices/ciPipelineSlice";

export function TriggerConfiguration() {
  const dispatch = useAppDispatch();
  const { selectedWorkflowIndex, workflows } = useAppSelector(state => state.ciPipeline);
  const workflow = workflows[selectedWorkflowIndex];

  if (!workflow) return null;

  const { triggers } = workflow;

  const handleUpdateTriggers = (updates: any) => {
    dispatch(updateWorkflowTriggers({
      index: selectedWorkflowIndex,
      triggers: updates
    }));
  };

  const updatePushTrigger = (updates: any) => {
    handleUpdateTriggers({
      push: { ...triggers.push, ...updates }
    });
  };

  const updatePullRequestTrigger = (updates: any) => {
    handleUpdateTriggers({
      pullRequest: { ...triggers.pullRequest, ...updates }
    });
  };

  const updateScheduleTrigger = (updates: any) => {
    handleUpdateTriggers({
      schedule: { ...triggers.schedule, ...updates }
    });
  };

  const updateManualTrigger = (updates: any) => {
    handleUpdateTriggers({
      manual: { ...triggers.manual, ...updates }
    });
  };

  const updateReleaseTrigger = (updates: any) => {
    handleUpdateTriggers({
      release: { ...triggers.release, ...updates }
    });
  };

  const handleBranchesChange = (triggerType: 'push' | 'pullRequest', branchesString: string) => {
    const branches = branchesString.split(',').map(b => b.trim()).filter(Boolean);
    if (triggerType === 'push') {
      updatePushTrigger({ branches });
    } else {
      updatePullRequestTrigger({ branches });
    }
  };

  const handlePathsChange = (pathsString: string) => {
    const paths = pathsString.split(',').map(p => p.trim()).filter(Boolean);
    updatePushTrigger({ paths });
  };

  const handleIgnoreChange = (ignoreString: string) => {
    const ignore = ignoreString.split(',').map(i => i.trim()).filter(Boolean);
    updatePushTrigger({ ignore });
  };

  const handlePRTypesChange = (type: string, checked: boolean) => {
    const types = checked 
      ? [...triggers.pullRequest.types, type as any]
      : triggers.pullRequest.types.filter(t => t !== type);
    updatePullRequestTrigger({ types });
  };

  const handleReleaseTypesChange = (type: string, checked: boolean) => {
    const types = checked 
      ? [...triggers.release.types, type as any]
      : triggers.release.types.filter(t => t !== type);
    updateReleaseTrigger({ types });
  };

  const enabledCount = [
    triggers.push.enabled,
    triggers.pullRequest.enabled,
    triggers.schedule.enabled,
    triggers.manual.enabled,
    triggers.release.enabled
  ].filter(Boolean).length;

  return (
    <div className="w-full max-w-none space-y-6 p-4 sm:p-6" data-testid="trigger-configuration">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <h3 className="text-lg font-semibold flex items-center gap-2 truncate">
            <Play className="w-5 h-5" />
            <span className="truncate">Trigger Configuration</span>
          </h3>
          <p className="text-sm text-muted-foreground break-words">
            Configure when your workflow should run
          </p>
        </div>
        <Badge className="flex-shrink-0 mt-3 sm:mt-0" variant={enabledCount > 0 ? "default" : "secondary"}>
          {enabledCount} trigger{enabledCount !== 1 ? 's' : ''} enabled
        </Badge>
      </div>

  <div className="grid grid-cols-1 gap-6 items-start min-w-0">
        {/* Push Triggers */}
  <Card className="w-full min-w-0 overflow-visible">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <GitBranch className="w-4 h-4" />
                <span className="truncate">Push Events</span>
              </div>
              <Switch
                className="flex-shrink-0"
                checked={triggers.push.enabled}
                onCheckedChange={(enabled) => updatePushTrigger({ enabled })}
                data-testid="push-trigger-enabled"
              />
            </CardTitle>
          </CardHeader>
          {triggers.push.enabled && (
            <CardContent className="space-y-4 min-w-0">
              <div className="space-y-2">
                <Label htmlFor="push-branches" className="text-sm font-medium">Branches</Label>
                <Input
                  id="push-branches"
                  className="w-full"
                  value={triggers.push.branches.join(', ')}
                  onChange={(e) => handleBranchesChange('push', e.target.value)}
                  placeholder="main, master, develop"
                  data-testid="push-branches-input"
                />
                <p className="text-xs text-muted-foreground break-words">
                  Comma-separated list of branches to trigger on
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="push-paths" className="text-sm font-medium">Paths (Optional)</Label>
                <Input
                  id="push-paths"
                  className="w-full"
                  value={triggers.push.paths?.join(', ') || ''}
                  onChange={(e) => handlePathsChange(e.target.value)}
                  placeholder="src/**, tests/**"
                  data-testid="push-paths-input"
                />
                <p className="text-xs text-muted-foreground break-words">
                  Only trigger when these paths change
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="push-ignore" className="text-sm font-medium">Ignore Paths (Optional)</Label>
                <Input
                  id="push-ignore"
                  className="w-full"
                  value={triggers.push.ignore?.join(', ') || ''}
                  onChange={(e) => handleIgnoreChange(e.target.value)}
                  placeholder="*.md, docs/**"
                  data-testid="push-ignore-input"
                />
                <p className="text-xs text-muted-foreground break-words">
                  Don't trigger when only these paths change
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Pull Request Triggers */}
  <Card className="w-full min-w-0 overflow-visible">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <GitPullRequest className="w-4 h-4" />
                <span className="truncate">Pull Request Events</span>
              </div>
              <Switch
                className="flex-shrink-0"
                checked={triggers.pullRequest.enabled}
                onCheckedChange={(enabled) => updatePullRequestTrigger({ enabled })}
                data-testid="pr-trigger-enabled"
              />
            </CardTitle>
          </CardHeader>
          {triggers.pullRequest.enabled && (
            <CardContent className="space-y-4 min-w-0">
              <div className="space-y-2">
                <Label htmlFor="pr-branches">Target Branches</Label>
                <Input
                  id="pr-branches"
                  value={triggers.pullRequest.branches.join(', ')}
                  onChange={(e) => handleBranchesChange('pullRequest', e.target.value)}
                  placeholder="main, master, develop"
                  data-testid="pr-branches-input"
                />
                <p className="text-xs text-muted-foreground">
                  Trigger when PRs target these branches
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">PR Event Types</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-w-0">
                  {[
                    { value: 'opened', label: 'Opened' },
                    { value: 'synchronize', label: 'Updated' },
                    { value: 'reopened', label: 'Reopened' },
                    { value: 'closed', label: 'Closed' },
                    { value: 'ready_for_review', label: 'Ready for Review' }
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2 min-w-0">
                      <Checkbox
                        id={`pr-type-${value}`}
                        checked={triggers.pullRequest.types.includes(value as any)}
                        onCheckedChange={(checked) => handlePRTypesChange(value, checked as boolean)}
                        data-testid={`pr-type-${value}`}
                      />
                      <Label htmlFor={`pr-type-${value}`} className="text-sm font-medium">
                        <span className="truncate" title={label}>{label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Schedule Triggers */}
  <Card className="w-full min-w-0 overflow-visible">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <Clock className="w-4 h-4" />
                Scheduled Runs
              </div>
              <Switch
                checked={triggers.schedule.enabled}
                onCheckedChange={(enabled) => updateScheduleTrigger({ enabled })}
                data-testid="schedule-trigger-enabled"
              />
            </CardTitle>
          </CardHeader>
          {triggers.schedule.enabled && (
            <CardContent className="space-y-4 min-w-0">
              <div className="space-y-2">
                <Label htmlFor="schedule-cron" className="text-sm font-medium">Cron Schedule</Label>
                <Input
                  id="schedule-cron"
                  className="w-full font-mono text-sm"
                  value={triggers.schedule.cron}
                  onChange={(e) => updateScheduleTrigger({ cron: e.target.value })}
                  placeholder="0 2 * * *"
                  data-testid="schedule-cron-input"
                />
                <p className="text-xs text-muted-foreground break-words">
                  Cron expression (e.g., "0 2 * * *" for daily at 2 AM UTC)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule-timezone" className="text-sm font-medium">Timezone (Optional)</Label>
                <Input
                  id="schedule-timezone"
                  className="w-full"
                  value={triggers.schedule.timezone || ''}
                  onChange={(e) => updateScheduleTrigger({ timezone: e.target.value || undefined })}
                  placeholder="UTC, America/New_York, Europe/London"
                  data-testid="schedule-timezone-input"
                />
              </div>
            </CardContent>
          )}
        </Card>

        {/* Manual Triggers */}
  <Card className="w-full min-w-0 overflow-visible">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <Play className="w-4 h-4" />
                Manual Dispatch
              </div>
              <Switch
                checked={triggers.manual.enabled}
                onCheckedChange={(enabled) => updateManualTrigger({ enabled })}
                data-testid="manual-trigger-enabled"
              />
            </CardTitle>
          </CardHeader>
          {triggers.manual.enabled && (
            <CardContent className="min-w-0">
              <p className="text-sm text-muted-foreground">
                Allows manual triggering of the workflow from the GitHub Actions UI.
                {triggers.manual.inputs && triggers.manual.inputs.length > 0 && 
                  ` Includes ${triggers.manual.inputs.length} input parameter${triggers.manual.inputs.length !== 1 ? 's' : ''}.`
                }
              </p>
            </CardContent>
          )}
        </Card>

        {/* Release Triggers */}
  <Card className="w-full min-w-0 overflow-visible">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 min-w-0 overflow-hidden">
              <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <Tag className="w-4 h-4" />
                Release Events
              </div>
              <Switch
                checked={triggers.release.enabled}
                onCheckedChange={(enabled) => updateReleaseTrigger({ enabled })}
                data-testid="release-trigger-enabled"
              />
            </CardTitle>
          </CardHeader>
            {triggers.release.enabled && (
            <CardContent className="space-y-3 min-w-0">
              <Label>Release Event Types</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { value: 'published', label: 'Published' },
                  { value: 'unpublished', label: 'Unpublished' },
                  { value: 'created', label: 'Created' },
                  { value: 'edited', label: 'Edited' },
                  { value: 'deleted', label: 'Deleted' },
                  { value: 'prereleased', label: 'Pre-released' }
                ].map(({ value, label }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`release-type-${value}`}
                      checked={triggers.release.types.includes(value as any)}
                      onCheckedChange={(checked) => handleReleaseTypesChange(value, checked as boolean)}
                      data-testid={`release-type-${value}`}
                    />
                    <Label htmlFor={`release-type-${value}`} className="text-sm">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

export default TriggerConfiguration;