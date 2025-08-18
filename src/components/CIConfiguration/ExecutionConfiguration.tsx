/**
 * ExecutionConfiguration.tsx
 * Purpose: UI sub-panel for configuring how tests execute (parallelism, sharding,
 * timeouts, retry strategy). Dispatches execution-related updates to the store.
 */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, RotateCcw, AlertTriangle, CheckCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { updateWorkflowExecution, updateWorkflowRetry } from "@/store/slices/ciPipelineSlice";

export function ExecutionConfiguration() {
  const dispatch = useAppDispatch();
  const { selectedWorkflowIndex, workflows } = useAppSelector(state => state.ciPipeline);
  const workflow = workflows[selectedWorkflowIndex];

  if (!workflow) return null;

  const { executionStrategy, retryStrategy } = workflow;

  const handleUpdateExecution = (updates: any) => {
    dispatch(updateWorkflowExecution({
      index: selectedWorkflowIndex,
      execution: updates
    }));
  };

  const handleUpdateRetry = (updates: any) => {
    dispatch(updateWorkflowRetry({
      index: selectedWorkflowIndex,
      retry: updates
    }));
  };

  const handleRetryConditionsChange = (condition: string, checked: boolean) => {
    const conditions = checked 
      ? [...retryStrategy.retryOn, condition as any]
      : retryStrategy.retryOn.filter(c => c !== condition);
    handleUpdateRetry({ retryOn: conditions });
  };

  const getExecutionDescription = () => {
    switch (executionStrategy.mode) {
      case 'parallel':
        return `Run tests in parallel across ${executionStrategy.parallelism || 4} workers`;
      case 'sequential':
        return 'Run tests one after another in sequence';
      case 'sharded':
        return `Split tests into ${executionStrategy.shards || 4} shards and run in parallel`;
      case 'matrix':
        return 'Run tests across multiple environment combinations';
      default:
        return 'Configure test execution strategy';
    }
  };

  const getTimeoutDisplay = () => {
    const timeout = executionStrategy.timeout;
    if (timeout < 60) return `${timeout} minutes`;
    return `${Math.floor(timeout / 60)}h ${timeout % 60}m`;
  };

  // ensure imported icons are treated as used in some builds
  void CheckCircle;

  return (
    <div className="space-y-6 w-full" data-testid="execution-configuration">
      <div className="flex items-center justify-between">
        <div className="space-y-1 min-w-0">
          <h3 className="text-lg font-semibold flex items-center gap-2 whitespace-nowrap">
            <Zap className="w-5 h-5" />
            Execution Strategy
          </h3>
          <p className="text-sm text-muted-foreground">
            {getExecutionDescription()}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1 whitespace-nowrap ml-4">
          <Clock className="w-3 h-3" />
          {getTimeoutDisplay()} max
        </Badge>
      </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Execution Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Test Execution Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Execution Mode</Label>
              <Select 
                value={executionStrategy.mode}
                onValueChange={(mode: any) => handleUpdateExecution({ mode })}
                data-testid="execution-mode-select"
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parallel">
                    <div className="flex flex-col items-start">
                      <span>Parallel Execution</span>
                      <span className="text-xs text-muted-foreground">
                        Run tests concurrently with configurable worker count
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sequential">
                    <div className="flex flex-col items-start">
                      <span>Sequential Execution</span>
                      <span className="text-xs text-muted-foreground">
                        Run tests one after another (slowest but most stable)
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sharded">
                    <div className="flex flex-col items-start">
                      <span>Sharded Execution</span>
                      <span className="text-xs text-muted-foreground">
                        Split test suite into shards for massive parallelization
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="matrix">
                    <div className="flex flex-col items-start">
                      <span>Matrix Execution</span>
                      <span className="text-xs text-muted-foreground">
                        Run tests across multiple environment combinations
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Parallel Configuration */}
            {executionStrategy.mode === 'parallel' && (
              <div className="space-y-3">
                <Label>Worker Count: {executionStrategy.parallelism}</Label>
                <Slider
                  value={[executionStrategy.parallelism || 4]}
                  onValueChange={([parallelism]) => handleUpdateExecution({ parallelism })}
                  max={16}
                  min={1}
                  step={1}
                  className="w-full"
                  data-testid="parallelism-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 worker</span>
                  <span>16 workers</span>
                </div>
              </div>
            )}

            {/* Sharded Configuration */}
            {executionStrategy.mode === 'sharded' && (
              <div className="space-y-3">
                <Label>Shard Count: {executionStrategy.shards}</Label>
                <Slider
                  value={[executionStrategy.shards || 4]}
                  onValueChange={([shards]) => handleUpdateExecution({ shards })}
                  max={20}
                  min={2}
                  step={1}
                  className="w-full"
                  data-testid="shards-slider"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2 shards</span>
                  <span>20 shards</span>
                </div>
              </div>
            )}

            {/* Timeout Configuration */}
            <div className="space-y-3">
              <Label>Timeout: {getTimeoutDisplay()}</Label>
              <Slider
                value={[executionStrategy.timeout]}
                onValueChange={([timeout]) => handleUpdateExecution({ timeout })}
                max={180}
                min={5}
                step={5}
                className="w-full"
                data-testid="timeout-slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5 minutes</span>
                <span>3 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Handling */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Error Handling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Fail Fast</Label>
                <p className="text-xs text-muted-foreground">
                  Stop all jobs immediately when one fails
                </p>
              </div>
              <Switch
                checked={executionStrategy.failFast}
                onCheckedChange={(failFast) => handleUpdateExecution({ failFast })}
                data-testid="fail-fast-switch"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Continue on Error</Label>
                <p className="text-xs text-muted-foreground">
                  Continue workflow even if some jobs fail
                </p>
              </div>
              <Switch
                checked={executionStrategy.continueOnError}
                onCheckedChange={(continueOnError) => handleUpdateExecution({ continueOnError })}
                data-testid="continue-on-error-switch"
              />
            </div>
          </CardContent>
        </Card>

        {/* Retry Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Retry Strategy
              </div>
              <Switch
                checked={retryStrategy.enabled}
                onCheckedChange={(enabled) => handleUpdateRetry({ enabled })}
                data-testid="retry-enabled-switch"
              />
            </CardTitle>
          </CardHeader>
          {retryStrategy.enabled && (
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Max Attempts</Label>
                  <Input
                    type="number"
                    value={retryStrategy.maxAttempts}
                    onChange={(e) => handleUpdateRetry({ maxAttempts: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={5}
                    data-testid="max-attempts-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Delay (seconds)</Label>
                  <Input
                    type="number"
                    value={retryStrategy.delaySeconds}
                    onChange={(e) => handleUpdateRetry({ delaySeconds: parseInt(e.target.value) || 0 })}
                    min={0}
                    max={300}
                    data-testid="retry-delay-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Backoff Strategy</Label>
                <Select 
                  value={retryStrategy.backoffStrategy}
                  onValueChange={(backoffStrategy: any) => handleUpdateRetry({ backoffStrategy })}
                  data-testid="backoff-strategy-select"
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">
                      <div className="flex flex-col items-start">
                        <span>Fixed Delay</span>
                        <span className="text-xs text-muted-foreground">
                          Same delay between retries
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="linear">
                      <div className="flex flex-col items-start">
                        <span>Linear Backoff</span>
                        <span className="text-xs text-muted-foreground">
                          Delay increases linearly
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="exponential">
                      <div className="flex flex-col items-start">
                        <span>Exponential Backoff</span>
                        <span className="text-xs text-muted-foreground">
                          Delay doubles each retry
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Retry Conditions</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'failure', label: 'Test Failure' },
                    { value: 'timeout', label: 'Timeout' },
                    { value: 'cancelled', label: 'Cancelled' },
                    { value: 'network-error', label: 'Network Error' },
                    { value: 'infrastructure-failure', label: 'Infrastructure Failure' }
                  ].map(({ value, label }) => (
                    <div key={value} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`retry-condition-${value}`}
                        checked={retryStrategy.retryOn.includes(value as any)}
                        onChange={(e) => handleRetryConditionsChange(value, e.target.checked)}
                        className="rounded border-border"
                        data-testid={`retry-condition-${value}`}
                      />
                      <Label htmlFor={`retry-condition-${value}`} className="text-sm">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}

export default ExecutionConfiguration;