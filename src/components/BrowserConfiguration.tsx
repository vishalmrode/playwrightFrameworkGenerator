import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Chrome, Globe, Monitor, CheckCircle2, XCircle } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { toggleBrowser, selectAllBrowsers, deselectAllBrowsers } from "@/store/slices/browserSlice";

export const BrowserConfiguration = React.memo(() => {
  const dispatch = useAppDispatch();
  const { selectedBrowsers } = useAppSelector(state => state.browser);

  const handleBrowserToggle = React.useCallback((browser: "chromium" | "firefox" | "webkit") => {
    dispatch(toggleBrowser(browser));
  }, [dispatch]);

  const handleSelectAll = React.useCallback(() => {
    dispatch(selectAllBrowsers());
  }, [dispatch]);

  const handleDeselectAll = React.useCallback(() => {
    dispatch(deselectAllBrowsers());
  }, [dispatch]);

  const allSelected = React.useMemo(
    () => Object.values(selectedBrowsers).every(selected => selected),
    [selectedBrowsers]
  );
  
  const noneSelected = React.useMemo(
    () => Object.values(selectedBrowsers).every(selected => !selected),
    [selectedBrowsers]
  );

  return (
    <Card data-testid="browser-configuration">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Browser Selection</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              disabled={allSelected}
              data-testid="select-all-browsers"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeselectAll}
              disabled={noneSelected}
              data-testid="deselect-all-browsers"
            >
              <XCircle className="w-3 h-3 mr-1" />
              None
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Select which browsers to include in your Playwright configuration. This affects test execution, CI pipelines, and generated examples.
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="chromium" 
                checked={selectedBrowsers.chromium}
                onCheckedChange={() => handleBrowserToggle('chromium')}
                data-testid="chromium-checkbox" 
              />
              <Label htmlFor="chromium" className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Chrome className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Chromium</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Google Chrome, Microsoft Edge, and other Chromium-based browsers
                </span>
              </Label>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="firefox" 
                checked={selectedBrowsers.firefox}
                onCheckedChange={() => handleBrowserToggle('firefox')}
                data-testid="firefox-checkbox" 
              />
              <Label htmlFor="firefox" className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Firefox</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Mozilla Firefox browser with Gecko engine
                </span>
              </Label>
            </div>
            
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="webkit" 
                checked={selectedBrowsers.webkit}
                onCheckedChange={() => handleBrowserToggle('webkit')}
                data-testid="webkit-checkbox" 
              />
              <Label htmlFor="webkit" className="flex flex-col">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-gray-600" />
                  <span className="font-medium">Safari (WebKit)</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Safari browser and WebKit engine (mobile Safari on iOS)
                </span>
              </Label>
            </div>
          </div>

          {noneSelected && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg" data-testid="browser-selection-warning">
              <p className="text-sm text-destructive">
                ⚠️ At least one browser must be selected to generate a valid Playwright configuration.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

BrowserConfiguration.displayName = 'BrowserConfiguration';

export default BrowserConfiguration;