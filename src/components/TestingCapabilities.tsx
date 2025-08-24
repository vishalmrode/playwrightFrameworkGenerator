import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Monitor, Globe, AlertTriangle, Eye } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { toggleTestingCapability } from "@/store/slices/testingCapabilitiesSlice";
import { validateTestingCapabilities, getTestingCapabilitiesDescription, getIncludedUtilities } from "@/lib/ConfigureTestingCapabilities";

export function TestingCapabilities() {
  const dispatch = useAppDispatch();
  const testingCapabilities = useAppSelector((state) => state.testingCapabilities);
  
  const isValid = validateTestingCapabilities(testingCapabilities);
  const description = getTestingCapabilitiesDescription(testingCapabilities);
  const includedUtilities = getIncludedUtilities(testingCapabilities);


  // For demo/test: add local state for visual and e2e
  const [e2eTesting, setE2eTesting] = React.useState(false);
  const [visualTesting, setVisualTesting] = React.useState(false);

  const handleToggle = (type: 'uiTesting' | 'apiTesting', checked: boolean) => {
    dispatch(toggleTestingCapability({ type, enabled: checked }));
  };

  return (
    <Card data-testid="testing-capabilities">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" data-testid="testing-capabilities-title">
          Testing Capabilities
          {!isValid && (
            <Badge variant="destructive" className="text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Required
            </Badge>
          )}
        </CardTitle>
        <CardDescription data-testid="testing-capabilities-description">
          Select the testing capabilities to include in your framework. {description}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Testing Capability Options */}
          <div className="space-y-4">
            {/* E2E Testing */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="capability-e2e"
                checked={e2eTesting}
                onCheckedChange={setE2eTesting}
                data-testid="capability-e2e"
              />
              <Label htmlFor="capability-e2e" className="flex flex-col cursor-pointer">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  <span className="font-medium">E2E Testing</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  End-to-end browser automation and scenario testing
                </span>
              </Label>
            </div>
            {/* API Testing */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="capability-api"
                checked={testingCapabilities.apiTesting}
                onCheckedChange={(checked) => handleToggle('apiTesting', checked as boolean)}
                data-testid="capability-api"
              />
              <Label htmlFor="capability-api" className="flex flex-col cursor-pointer">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">API Testing</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  REST and GraphQL endpoint testing with request validation and response verification
                </span>
              </Label>
            </div>
            {/* Visual Testing */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="capability-visual"
                checked={visualTesting}
                onCheckedChange={setVisualTesting}
                data-testid="capability-visual"
              />
              <Label htmlFor="capability-visual" className="flex flex-col cursor-pointer">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span className="font-medium">Visual Testing</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Visual regression and screenshot comparison
                </span>
              </Label>
            </div>
          </div>

          {/* Included Utilities */}
          {includedUtilities.length > 0 && (
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-medium mb-3">Included Utilities:</h4>
              <div className="flex flex-wrap gap-2">
                {includedUtilities.map((utility) => (
                  <Badge key={utility} variant="secondary" className="text-xs">
                    {utility}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Validation Warning */}
          {!isValid && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">At least one testing capability must be selected</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TestingCapabilities;