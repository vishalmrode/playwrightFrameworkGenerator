export interface TestingCapabilities {
  uiTesting: boolean;
  apiTesting: boolean;
  visualTesting: boolean;
  accessibilityTesting: boolean;
  performanceTesting: boolean;
  crossBrowserTesting: boolean;
}

export type TestingCapabilityType = keyof TestingCapabilities;