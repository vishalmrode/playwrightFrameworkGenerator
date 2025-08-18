/**
 * NotificationConfiguration.tsx
 * Purpose: Configure notification channels (Slack, Email, GitHub, Teams) for
 * CI workflow results. Updates notification portion of workflow config.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Slack, Mail, MessageSquare, Github, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateWorkflowNotifications } from "@/store/slices/ciPipelineSlice";
import { useState } from "react";

export function NotificationConfiguration() {
  const dispatch = useAppDispatch();
  const { selectedWorkflowIndex, workflows } = useAppSelector(state => state.ciPipeline);
  const workflow = workflows[selectedWorkflowIndex];
  const [newSlackChannel, setNewSlackChannel] = useState("");
  const [newEmailRecipient, setNewEmailRecipient] = useState("");

  if (!workflow) return null;

  const { notifications } = workflow;

  const handleUpdateNotifications = (updates: any) => {
    dispatch(updateWorkflowNotifications({
      index: selectedWorkflowIndex,
      notifications: updates
    }));
  };

  const handleAddSlackChannel = () => {
    if (newSlackChannel.trim()) {
      const channels = [...notifications.slack.channels, newSlackChannel.trim()];
      handleUpdateNotifications({
        slack: { ...notifications.slack, channels }
      });
      setNewSlackChannel("");
    }
  };

  const handleRemoveSlackChannel = (index: number) => {
    const channels = notifications.slack.channels.filter((_, i) => i !== index);
    handleUpdateNotifications({
      slack: { ...notifications.slack, channels }
    });
  };

  const handleAddEmailRecipient = () => {
    if (newEmailRecipient.trim() && newEmailRecipient.includes('@')) {
      const recipients = [...notifications.email.recipients, newEmailRecipient.trim()];
      handleUpdateNotifications({
        email: { ...notifications.email, recipients }
      });
      setNewEmailRecipient("");
    }
  };

  const handleRemoveEmailRecipient = (index: number) => {
    const recipients = notifications.email.recipients.filter((_, i) => i !== index);
    handleUpdateNotifications({
      email: { ...notifications.email, recipients }
    });
  };

  const enabledNotificationsCount = [
    notifications.slack.enabled,
    notifications.teams.enabled,
    notifications.email.enabled,
    notifications.github.enabled
  ].filter(Boolean).length;

  // prevent unused import warning in certain build configurations
  void Textarea;

  return (
    <div className="space-y-6" data-testid="notification-configuration">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure how you want to be notified about test results
          </p>
        </div>
        <Badge variant={enabledNotificationsCount > 0 ? "default" : "secondary"}>
          {enabledNotificationsCount} channel{enabledNotificationsCount !== 1 ? 's' : ''} enabled
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Slack Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Slack className="w-4 h-4" />
                Slack Notifications
              </div>
              <Switch
                checked={notifications.slack.enabled}
                onCheckedChange={(enabled) => handleUpdateNotifications({
                  slack: { ...notifications.slack, enabled }
                })}
                data-testid="slack-notifications-enabled"
              />
            </CardTitle>
          </CardHeader>
          {notifications.slack.enabled && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slack-webhook">Webhook URL</Label>
                <Input
                  id="slack-webhook"
                  type="password"
                  value={notifications.slack.webhook || ''}
                  onChange={(e) => handleUpdateNotifications({
                    slack: { ...notifications.slack, webhook: e.target.value }
                  })}
                  placeholder="https://hooks.slack.com/services/..."
                  data-testid="slack-webhook-input"
                />
                <p className="text-xs text-muted-foreground">
                  Create an incoming webhook in your Slack workspace
                </p>
              </div>

              <div className="space-y-3">
                <Label>Channels</Label>
                {notifications.slack.channels.length > 0 && (
                  <div className="space-y-2">
                    {notifications.slack.channels.map((channel, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm font-mono">#{channel}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveSlackChannel(index)}
                          data-testid={`remove-slack-channel-${index}`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={newSlackChannel}
                    onChange={(e) => setNewSlackChannel(e.target.value)}
                    placeholder="channel-name"
                    data-testid="slack-channel-input"
                  />
                  <Button
                    onClick={handleAddSlackChannel}
                    disabled={!newSlackChannel.trim()}
                    size="sm"
                    data-testid="add-slack-channel-button"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>On Success</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify when tests pass
                    </p>
                  </div>
                  <Switch
                    checked={notifications.slack.onSuccess}
                    onCheckedChange={(onSuccess) => handleUpdateNotifications({
                      slack: { ...notifications.slack, onSuccess }
                    })}
                    data-testid="slack-on-success"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>On Failure</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify when tests fail
                    </p>
                  </div>
                  <Switch
                    checked={notifications.slack.onFailure}
                    onCheckedChange={(onFailure) => handleUpdateNotifications({
                      slack: { ...notifications.slack, onFailure }
                    })}
                    data-testid="slack-on-failure"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Microsoft Teams Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Microsoft Teams
              </div>
              <Switch
                checked={notifications.teams.enabled}
                onCheckedChange={(enabled) => handleUpdateNotifications({
                  teams: { ...notifications.teams, enabled }
                })}
                data-testid="teams-notifications-enabled"
              />
            </CardTitle>
          </CardHeader>
          {notifications.teams.enabled && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teams-webhook">Webhook URL</Label>
                <Input
                  id="teams-webhook"
                  type="password"
                  value={notifications.teams.webhook || ''}
                  onChange={(e) => handleUpdateNotifications({
                    teams: { ...notifications.teams, webhook: e.target.value }
                  })}
                  placeholder="https://outlook.office.com/webhook/..."
                  data-testid="teams-webhook-input"
                />
                <p className="text-xs text-muted-foreground">
                  Create an incoming webhook connector in Teams
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>On Success</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify when tests pass
                    </p>
                  </div>
                  <Switch
                    checked={notifications.teams.onSuccess}
                    onCheckedChange={(onSuccess) => handleUpdateNotifications({
                      teams: { ...notifications.teams, onSuccess }
                    })}
                    data-testid="teams-on-success"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>On Failure</Label>
                    <p className="text-xs text-muted-foreground">
                      Notify when tests fail
                    </p>
                  </div>
                  <Switch
                    checked={notifications.teams.onFailure}
                    onCheckedChange={(onFailure) => handleUpdateNotifications({
                      teams: { ...notifications.teams, onFailure }
                    })}
                    data-testid="teams-on-failure"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </div>
              <Switch
                checked={notifications.email.enabled}
                onCheckedChange={(enabled) => handleUpdateNotifications({
                  email: { ...notifications.email, enabled }
                })}
                data-testid="email-notifications-enabled"
              />
            </CardTitle>
          </CardHeader>
          {notifications.email.enabled && (
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Recipients</Label>
                {notifications.email.recipients.length > 0 && (
                  <div className="space-y-2">
                    {notifications.email.recipients.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm font-mono">{email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmailRecipient(index)}
                          data-testid={`remove-email-recipient-${index}`}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={newEmailRecipient}
                    onChange={(e) => setNewEmailRecipient(e.target.value)}
                    placeholder="user@example.com"
                    data-testid="email-recipient-input"
                  />
                  <Button
                    onClick={handleAddEmailRecipient}
                    disabled={!newEmailRecipient.trim() || !newEmailRecipient.includes('@')}
                    size="sm"
                    data-testid="add-email-recipient-button"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>On Success</Label>
                    <p className="text-xs text-muted-foreground">
                      Email when tests pass
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email.onSuccess}
                    onCheckedChange={(onSuccess) => handleUpdateNotifications({
                      email: { ...notifications.email, onSuccess }
                    })}
                    data-testid="email-on-success"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>On Failure</Label>
                    <p className="text-xs text-muted-foreground">
                      Email when tests fail
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email.onFailure}
                    onCheckedChange={(onFailure) => handleUpdateNotifications({
                      email: { ...notifications.email, onFailure }
                    })}
                    data-testid="email-on-failure"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* GitHub Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Integration
              </div>
              <Switch
                checked={notifications.github.enabled}
                onCheckedChange={(enabled) => handleUpdateNotifications({
                  github: { ...notifications.github, enabled }
                })}
                data-testid="github-notifications-enabled"
              />
            </CardTitle>
          </CardHeader>
          {notifications.github.enabled && (
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Check Runs</Label>
                    <p className="text-xs text-muted-foreground">
                      Create check runs for test results
                    </p>
                  </div>
                  <Switch
                    checked={notifications.github.checkRuns}
                    onCheckedChange={(checkRuns) => handleUpdateNotifications({
                      github: { ...notifications.github, checkRuns }
                    })}
                    data-testid="github-check-runs"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Status Checks</Label>
                    <p className="text-xs text-muted-foreground">
                      Update commit status
                    </p>
                  </div>
                  <Switch
                    checked={notifications.github.statusChecks}
                    onCheckedChange={(statusChecks) => handleUpdateNotifications({
                      github: { ...notifications.github, statusChecks }
                    })}
                    data-testid="github-status-checks"
                  />
                </div>

                <div className="flex items-center justify-between sm:col-span-2">
                  <div className="space-y-1">
                    <Label>PR Comments</Label>
                    <p className="text-xs text-muted-foreground">
                      Comment on pull requests with test results
                    </p>
                  </div>
                  <Switch
                    checked={notifications.github.pullRequestComments}
                    onCheckedChange={(pullRequestComments) => handleUpdateNotifications({
                      github: { ...notifications.github, pullRequestComments }
                    })}
                    data-testid="github-pr-comments"
                  />
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Summary */}
        {enabledNotificationsCount > 0 && (
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Bell className="w-4 h-4" />
                Notification Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-700 dark:text-blue-300">
              <div className="space-y-2">
                {notifications.slack.enabled && (
                  <div className="flex items-center justify-between">
                    <span>Slack:</span>
                    <span>{notifications.slack.channels.length} channels</span>
                  </div>
                )}
                {notifications.teams.enabled && (
                  <div className="flex items-center justify-between">
                    <span>Teams:</span>
                    <span>Webhook configured</span>
                  </div>
                )}
                {notifications.email.enabled && (
                  <div className="flex items-center justify-between">
                    <span>Email:</span>
                    <span>{notifications.email.recipients.length} recipients</span>
                  </div>
                )}
                {notifications.github.enabled && (
                  <div className="flex items-center justify-between">
                    <span>GitHub:</span>
                    <span>
                      {[
                        notifications.github.checkRuns && 'checks',
                        notifications.github.statusChecks && 'status',
                        notifications.github.pullRequestComments && 'comments'
                      ].filter(Boolean).join(', ')}
                    </span>
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

export default NotificationConfiguration;