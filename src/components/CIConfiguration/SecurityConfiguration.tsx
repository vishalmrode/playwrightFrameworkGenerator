/**
 * SecurityConfiguration.tsx
 * Purpose: Configure security scans, dependency checks, and workflow permissions.
 * Presents a score and recommendations based on selected options.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateWorkflowSecurity } from "@/store/slices/ciPipelineSlice";

export function SecurityConfiguration() {
  const dispatch = useAppDispatch();
  const { selectedWorkflowIndex, workflows } = useAppSelector(state => state.ciPipeline);
  const workflow = workflows[selectedWorkflowIndex];

  if (!workflow) return null;

  const { security } = workflow;

  const handleUpdateSecurity = (updates: any) => {
    dispatch(updateWorkflowSecurity({
      index: selectedWorkflowIndex,
      security: updates
    }));
  };

  const handlePermissionChange = (permission: string, value: 'read' | 'write') => {
    const permissions = { ...security.permissions, [permission]: value };
    handleUpdateSecurity({ permissions });
  };

  const enabledSecurityFeaturesCount = [
    security.secretScanning,
    security.dependencyCheck,
    security.codeAnalysis
  ].filter(Boolean).length;

  // referenced to avoid TS6133 when feature flagging removes usage
  void enabledSecurityFeaturesCount;

  const getSecurityScore = () => {
    let score = 0;
    if (security.secretScanning) score += 25;
    if (security.dependencyCheck) score += 25;
    if (security.codeAnalysis) score += 25;
    
    // Check for minimal permissions
    const restrictivePermissions = Object.values(security.permissions).filter(p => p === 'read').length;
    const totalPermissions = Object.keys(security.permissions).length;
    score += Math.round((restrictivePermissions / totalPermissions) * 25);
    
    return score;
  };

  const securityScore = getSecurityScore();

  const getScoreVariant = () => {
    if (securityScore >= 80) return 'default';
    if (securityScore >= 60) return 'secondary';
    return 'destructive';
  };

  const getScoreIcon = () => {
    if (securityScore >= 80) return <CheckCircle className="w-3 h-3" />;
    if (securityScore >= 60) return <Shield className="w-3 h-3" />;
    return <AlertTriangle className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6" data-testid="security-configuration">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security & Permissions
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure security scanning and workflow permissions
          </p>
        </div>
        <Badge variant={getScoreVariant()} className="flex items-center gap-1">
          {getScoreIcon()}
          Security Score: {securityScore}%
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* Security Scanning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Security Scanning
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Secret Scanning</Label>
                <p className="text-xs text-muted-foreground">
                  Scan code for exposed secrets and credentials
                </p>
              </div>
              <Switch
                checked={security.secretScanning}
                onCheckedChange={(secretScanning) => handleUpdateSecurity({ secretScanning })}
                data-testid="secret-scanning-enabled"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Dependency Vulnerability Check</Label>
                <p className="text-xs text-muted-foreground">
                  Scan dependencies for known vulnerabilities
                </p>
              </div>
              <Switch
                checked={security.dependencyCheck}
                onCheckedChange={(dependencyCheck) => handleUpdateSecurity({ dependencyCheck })}
                data-testid="dependency-check-enabled"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Static Code Analysis</Label>
                <p className="text-xs text-muted-foreground">
                  Analyze code for security issues and bugs
                </p>
              </div>
              <Switch
                checked={security.codeAnalysis}
                onCheckedChange={(codeAnalysis) => handleUpdateSecurity({ codeAnalysis })}
                data-testid="code-analysis-enabled"
              />
            </div>
          </CardContent>
        </Card>

        {/* Workflow Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Workflow Permissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Contents</Label>
                <Select
                  value={security.permissions.contents}
                  onValueChange={(value: 'read' | 'write') => handlePermissionChange('contents', value)}
                  data-testid="contents-permission-select"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Access to repository contents</p>
              </div>

              <div className="space-y-2">
                <Label>Actions</Label>
                <Select
                  value={security.permissions.actions}
                  onValueChange={(value: 'read' | 'write') => handlePermissionChange('actions', value)}
                  data-testid="actions-permission-select"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Access to GitHub Actions</p>
              </div>

              <div className="space-y-2">
                <Label>Checks</Label>
                <Select
                  value={security.permissions.checks}
                  onValueChange={(value: 'read' | 'write') => handlePermissionChange('checks', value)}
                  data-testid="checks-permission-select"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Create and update check runs</p>
              </div>

              <div className="space-y-2">
                <Label>Deployments</Label>
                <Select
                  value={security.permissions.deployments}
                  onValueChange={(value: 'read' | 'write') => handlePermissionChange('deployments', value)}
                  data-testid="deployments-permission-select"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Access to deployments</p>
              </div>

              <div className="space-y-2">
                <Label>Issues</Label>
                <Select
                  value={security.permissions.issues}
                  onValueChange={(value: 'read' | 'write') => handlePermissionChange('issues', value)}
                  data-testid="issues-permission-select"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Create and manage issues</p>
              </div>

              <div className="space-y-2">
                <Label>Packages</Label>
                <Select
                  value={security.permissions.packages}
                  onValueChange={(value: 'read' | 'write') => handlePermissionChange('packages', value)}
                  data-testid="packages-permission-select"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Access to GitHub Packages</p>
              </div>

              <div className="space-y-2">
                <Label>Pull Requests</Label>
                <Select
                  value={security.permissions.pullRequests}
                  onValueChange={(value: 'read' | 'write') => handlePermissionChange('pullRequests', value)}
                  data-testid="pull-requests-permission-select"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Comment on pull requests</p>
              </div>

              <div className="space-y-2">
                <Label>Security Events</Label>
                <Select
                  value={security.permissions.security}
                  onValueChange={(value: 'read' | 'write') => handlePermissionChange('security', value)}
                  data-testid="security-permission-select"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Access to security events</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Recommendations */}
        <Card className={`${securityScore < 60 ? 'border-destructive bg-destructive/5' : securityScore < 80 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' : 'border-green-500 bg-green-50 dark:bg-green-950/20'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getScoreIcon()}
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {!security.secretScanning && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Enable Secret Scanning:</strong> This helps prevent accidental exposure of API keys, passwords, and other sensitive information in your code.
                  </div>
                </div>
              )}

              {!security.dependencyCheck && (
                <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Enable Dependency Scanning:</strong> Regularly check for known vulnerabilities in your project dependencies.
                  </div>
                </div>
              )}

              {security.permissions.contents === 'write' && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-300 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Contents Permission:</strong> Consider if your workflow really needs write access to repository contents. Read-only is more secure.
                  </div>
                </div>
              )}

              {securityScore >= 80 && (
                <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong>Great security setup!</strong> Your workflow follows security best practices with proper scanning and minimal permissions.
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                <strong>Security Score Factors:</strong>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Secret scanning enabled (+25%)</li>
                  <li>Dependency vulnerability checks (+25%)</li>
                  <li>Static code analysis (+25%)</li>
                  <li>Minimal permissions (+25%)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default SecurityConfiguration;