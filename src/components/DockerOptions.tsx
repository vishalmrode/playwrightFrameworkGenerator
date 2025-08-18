import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Container, Layers, Settings, GitBranch, Heart } from "lucide-react";
import { useEffect, useState } from 'react';

function AppleSiliconHint() {
  const [isAppleSilicon, setIsAppleSilicon] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const isMac = /Macintosh|Mac OS X/.test(ua);
      const isAppleSiliconArch = /Apple M1|Apple M2|ARM/.test(ua) || (isMac && navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints === 0 && (navigator as any).hardwareConcurrency >= 4);
      setIsAppleSilicon(isMac ? isAppleSiliconArch : false);
    } catch (e) {
      setIsAppleSilicon(false);
    }
  }, []);

  if (isAppleSilicon === null) return null;
  if (!isAppleSilicon) return null;

  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 p-2 flex items-center justify-between gap-3">
      <div>
        <span className="font-medium">Apple Silicon</span>
        <div className="text-xs text-muted-foreground">Use multi‑arch images for best performance on M1/M2. x86 images require emulation.</div>
      </div>
      <a
        href="https://docs.docker.com/buildx/working-with-buildx/"
        target="_blank"
        rel="noreferrer"
        className="text-xs text-primary underline"
      >
        Learn more
      </a>
    </div>
  );
}

// Image -> architecture overrides (specific tags). Extend as needed.
const IMAGE_ARCH_OVERRIDES: Record<string, 'multi' | 'x86'> = {
  // node:18-playwright is known to be multi-arch in many registries, but add example override below
  // 'node:18-playwright': 'x86',
  // Specific pinned tags can be added here when you know they are x86-only
};
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import {
  setDockerEnabled,
  setBaseImage,
  setCustomImage,
  toggleDockerFeature,
  setMemoryLimit,
  setCpuLimit,
} from "@/store/slices/dockerSlice";
import { DockerBaseImage, DockerMemoryLimit, DockerCpuLimit, DOCKER_IMAGE_OPTIONS } from "@/types/docker";

export function DockerOptions() {
  const dispatch = useAppDispatch();
  const dockerConfig = useAppSelector((state) => state.docker.config);

  const handleEnableDocker = (enabled: boolean) => {
    dispatch(setDockerEnabled(enabled));
  };

  const handleBaseImageChange = (value: DockerBaseImage) => {
    dispatch(setBaseImage(value));
  };

  const handleCustomImageChange = (value: string) => {
    dispatch(setCustomImage(value));
  };

  const handleFeatureToggle = (feature: keyof typeof dockerConfig.features) => {
    dispatch(toggleDockerFeature(feature));
  };

  const handleMemoryLimitChange = (value: DockerMemoryLimit) => {
    dispatch(setMemoryLimit(value));
  };

  const handleCpuLimitChange = (value: DockerCpuLimit) => {
    dispatch(setCpuLimit(value));
  };

  return (
    <Card data-testid="docker-options">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Container className="w-5 h-5" />
          Docker Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-docker" className="flex items-center gap-2">
              <Container className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="font-medium">Enable Docker Support</span>
                <span className="text-sm text-muted-foreground">Containerized test execution</span>
              </div>
            </Label>
            <Switch 
              id="enable-docker" 
              checked={dockerConfig.enabled}
              onCheckedChange={handleEnableDocker}
              data-testid="enable-docker-switch" 
            />
          </div>

          {dockerConfig.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-start gap-2">
                  <Layers className="w-4 h-4" />
                  <span className="text-left">Base Image</span>
                </Label>
                <Select 
                  value={dockerConfig.baseImage} 
                  onValueChange={handleBaseImageChange}
                  data-testid="base-image-select"
                >
                  <SelectTrigger className="w-full text-left">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCKER_IMAGE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* macOS / Apple Silicon hint - shown when running in a macOS browser and image is x86-only or unknown */}
                {(() => {
                  const option = DOCKER_IMAGE_OPTIONS.find((o) => o.value === dockerConfig.baseImage);
                  const shouldShow = (() => {
                    if (!option) return false;
                    const override = IMAGE_ARCH_OVERRIDES[option.image];
                    if (override) return override === 'x86';
                    return option.arch === 'x86';
                  })();
                  return shouldShow ? (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <AppleSiliconHint />
                    </div>
                  ) : null;
                })()}
                
                {dockerConfig.baseImage === 'custom' && (
                  <div className="mt-2">
                    <Label className="text-xs text-muted-foreground">Custom Image Name</Label>
                    <Input
                      placeholder="e.g., node:18-alpine"
                      value={dockerConfig.customImage || ''}
                      onChange={(e) => handleCustomImageChange(e.target.value)}
                      data-testid="custom-image-input"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Docker Features</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="docker-compose" 
                      checked={dockerConfig.features.dockerCompose}
                      onCheckedChange={() => handleFeatureToggle('dockerCompose')}
                      data-testid="docker-compose-checkbox" 
                    />
                    <Label htmlFor="docker-compose" className="flex items-center gap-2">
                      <Layers className="w-3 h-3" />
                      Docker Compose setup
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="multi-stage" 
                      checked={dockerConfig.features.multiStage}
                      onCheckedChange={() => handleFeatureToggle('multiStage')}
                      data-testid="multi-stage-checkbox" 
                    />
                    <Label htmlFor="multi-stage" className="flex items-center gap-2">
                      <GitBranch className="w-3 h-3" />
                      Multi-stage build
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="health-checks" 
                      checked={dockerConfig.features.healthChecks}
                      onCheckedChange={() => handleFeatureToggle('healthChecks')}
                      data-testid="health-checks-checkbox" 
                    />
                    <Label htmlFor="health-checks" className="flex items-center gap-2">
                      <Heart className="w-3 h-3" />
                      Container health checks
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Container Resources
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Memory Limit</Label>
                    <Select 
                      value={dockerConfig.resources.memoryLimit} 
                      onValueChange={handleMemoryLimitChange}
                      data-testid="memory-limit-select"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1g">1GB</SelectItem>
                        <SelectItem value="2g">2GB</SelectItem>
                        <SelectItem value="4g">4GB</SelectItem>
                        <SelectItem value="8g">8GB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">CPU Limit</Label>
                    <Select 
                      value={dockerConfig.resources.cpuLimit} 
                      onValueChange={handleCpuLimitChange}
                      data-testid="cpu-limit-select"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 CPU</SelectItem>
                        <SelectItem value="2">2 CPUs</SelectItem>
                        <SelectItem value="4">4 CPUs</SelectItem>
                        <SelectItem value="8">8 CPUs</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default DockerOptions;