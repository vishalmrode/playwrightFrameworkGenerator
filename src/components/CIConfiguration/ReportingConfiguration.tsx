import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { FileText, BarChart3, Globe, Target, Plus, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateWorkflowReporting } from "@/store/slices/ciPipelineSlice";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ReportingConfiguration() {
  const dispatch = useAppDispatch();
  const { selectedWorkflowIndex, workflows } = useAppSelector(state => state.ciPipeline);
  const workflow = workflows[selectedWorkflowIndex];
  const [newReportName, setNewReportName] = useState("");
  const [newReportCommand, setNewReportCommand] = useState("");
  const [newReportPath, setNewReportPath] = useState("");
  const [newReportFormat, setNewReportFormat] = useState("");

  if (!workflow) return null;

  const { reporting } = workflow;

  const handleUpdateReporting = (updates: any) => {
    dispatch(updateWorkflowReporting({
      index: selectedWorkflowIndex,
      reporting: updates
    }));
  };

  const handleCoverageFormatsChange = (format: string, checked: boolean) => {
    const formats = checked 
      ? [...reporting.coverage.formats, format as any]
      : reporting.coverage.formats.filter(f => f !== format);
    handleUpdateReporting({
      coverage: { ...reporting.coverage, formats }
    });
  };

  const handleAddCustomReport = () => {
    if (newReportName.trim() && newReportCommand.trim() && newReportPath.trim() && newReportFormat.trim()) {
      const customReports = [
        ...reporting.customReports,
        {
          name: newReportName.trim(),
          command: newReportCommand.trim(),
          outputPath: newReportPath.trim(),
          format: newReportFormat.trim()
        }
      ];
      handleUpdateReporting({ customReports });
      setNewReportName("");
      setNewReportCommand("");
      setNewReportPath("");
      setNewReportFormat("");
    }
  };

  const handleRemoveCustomReport = (index: number) => {
    const customReports = reporting.customReports.filter((_, i) => i !== index);
    handleUpdateReporting({ customReports });
  };

  const enabledReportsCount = [
    reporting.htmlReport.enabled,
    reporting.junit.enabled,
    reporting.coverage.enabled,
    reporting.allure.enabled
  ].filter(Boolean).length + reporting.customReports.length;

  const getRetentionDisplay = (days: number) => {
    if (days === 1) return "1 day";
    if (days < 30) return `${days} days`;
    if (days === 30) return "1 month";
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6" data-testid="reporting-configuration">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Test Reporting
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure test result reporting and publishing
          </p>
        </div>
        <Badge variant={enabledReportsCount > 0 ? "default" : "secondary"}>
          {enabledReportsCount} report{enabledReportsCount !== 1 ? 's' : ''} enabled
        </Badge>
      </div>

      <div className="grid gap-6">
        {/* HTML Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                HTML Report
              </div>
              <Switch
                checked={reporting.htmlReport.enabled}
                onCheckedChange={(enabled) => handleUpdateReporting({
                  htmlReport: { ...reporting.htmlReport, enabled }
                })}
                data-testid="html-report-enabled"
              />
            </CardTitle>
          </CardHeader>
          {reporting.htmlReport.enabled && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Publish to GitHub Pages</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically deploy report to GitHub Pages
                  </p>
                </div>
                <Switch
                  checked={reporting.htmlReport.publishToPages}
                  onCheckedChange={(publishToPages) => handleUpdateReporting({
                    htmlReport: { ...reporting.htmlReport, publishToPages }
                  })}
                  data-testid="html-report-publish-pages"
                />
              </div>

              <div className="space-y-3">
                <Label>Retention Period: {getRetentionDisplay(reporting.htmlReport.retention)}</Label>
                <Slider
                  value={[reporting.htmlReport.retention]}
                  onValueChange={([retention]) => handleUpdateReporting({
                    htmlReport: { ...reporting.htmlReport, retention }
                  })}
                  max={365}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="html-report-retention-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 day</span>
                  <span>1 year</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* JUnit Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                JUnit XML Report
              </div>
              <Switch
                checked={reporting.junit.enabled}
                onCheckedChange={(enabled) => handleUpdateReporting({
                  junit: { ...reporting.junit, enabled }
                })}
                data-testid="junit-report-enabled"
              />
            </CardTitle>
          </CardHeader>
          {reporting.junit.enabled && (
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="junit-output-path">Output Path</Label>
                <Input
                  id="junit-output-path"
                  value={reporting.junit.outputPath}
                  onChange={(e) => handleUpdateReporting({
                    junit: { ...reporting.junit, outputPath: e.target.value }
                  })}
                  placeholder="test-results/junit.xml"
                  data-testid="junit-output-path-input"
                />
                <p className="text-xs text-muted-foreground">
                  Path where JUnit XML report will be saved
                </p>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Coverage Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Code Coverage
              </div>
              <Switch
                checked={reporting.coverage.enabled}
                onCheckedChange={(enabled) => handleUpdateReporting({
                  coverage: { ...reporting.coverage, enabled }
                })}
                data-testid="coverage-report-enabled"
              />
            </CardTitle>
          </CardHeader>
          {reporting.coverage.enabled && (
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Coverage Threshold: {reporting.coverage.threshold}%</Label>
                <Slider
                  value={[reporting.coverage.threshold]}
                  onValueChange={([threshold]) => handleUpdateReporting({
                    coverage: { ...reporting.coverage, threshold }
                  })}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                  data-testid="coverage-threshold-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Report Formats</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { value: 'lcov', label: 'LCOV' },
                    { value: 'cobertura', label: 'Cobertura' },
                    { value: 'clover', label: 'Clover' },
                    { value: 'json', label: 'JSON' },
                    { value: 'text', label: 'Text' }
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`coverage-format-${value}`}
                        checked={reporting.coverage.formats.includes(value as any)}
                        onCheckedChange={(checked) => handleCoverageFormatsChange(value, checked as boolean)}
                        data-testid={`coverage-format-${value}`}
                      />
                      <Label htmlFor={`coverage-format-${value}`} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Allure Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Allure Report
              </div>
              <Switch
                checked={reporting.allure.enabled}
                onCheckedChange={(enabled) => handleUpdateReporting({
                  allure: { ...reporting.allure, enabled }
                })}
                data-testid="allure-report-enabled"
              />
            </CardTitle>
          </CardHeader>
          {reporting.allure.enabled && (
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Publish to GitHub Pages</Label>
                  <p className="text-xs text-muted-foreground">
                    Deploy Allure report to GitHub Pages
                  </p>
                </div>
                <Switch
                  checked={reporting.allure.publishToPages}
                  onCheckedChange={(publishToPages) => handleUpdateReporting({
                    allure: { ...reporting.allure, publishToPages }
                  })}
                  data-testid="allure-report-publish-pages"
                />
              </div>

              <div className="space-y-3">
                <Label>Retention Period: {getRetentionDisplay(reporting.allure.retention)}</Label>
                <Slider
                  value={[reporting.allure.retention]}
                  onValueChange={([retention]) => handleUpdateReporting({
                    allure: { ...reporting.allure, retention }
                  })}
                  max={365}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="allure-report-retention-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 day</span>
                  <span>1 year</span>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Custom Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Custom Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Custom Reports */}
            {reporting.customReports.length > 0 && (
              <div className="space-y-3">
                {reporting.customReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Command: {report.command}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Output: {report.outputPath} ({report.format})
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveCustomReport(index)}
                      data-testid={`remove-custom-report-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Custom Report */}
            <div className="space-y-3 p-3 border border-dashed border-border rounded-lg">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="custom-report-name">Report Name</Label>
                  <Input
                    id="custom-report-name"
                    value={newReportName}
                    onChange={(e) => setNewReportName(e.target.value)}
                    placeholder="e.g., Lighthouse Report"
                    data-testid="custom-report-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-report-format">Format</Label>
                  <Input
                    id="custom-report-format"
                    value={newReportFormat}
                    onChange={(e) => setNewReportFormat(e.target.value)}
                    placeholder="e.g., html, json, xml"
                    data-testid="custom-report-format-input"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-report-command">Generation Command</Label>
                <Input
                  id="custom-report-command"
                  value={newReportCommand}
                  onChange={(e) => setNewReportCommand(e.target.value)}
                  placeholder="e.g., npm run lighthouse:ci"
                  data-testid="custom-report-command-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-report-path">Output Path</Label>
                <Input
                  id="custom-report-path"
                  value={newReportPath}
                  onChange={(e) => setNewReportPath(e.target.value)}
                  placeholder="e.g., lighthouse-results/"
                  data-testid="custom-report-path-input"
                />
              </div>
              <Button
                onClick={handleAddCustomReport}
                disabled={!newReportName.trim() || !newReportCommand.trim() || !newReportPath.trim() || !newReportFormat.trim()}
                size="sm"
                data-testid="add-custom-report-button"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Report
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Custom reports will be generated using your specified command and archived as CI artifacts.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ReportingConfiguration;