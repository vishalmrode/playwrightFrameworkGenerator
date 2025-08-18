export type BrowserType = 'chromium' | 'firefox' | 'webkit';

export interface BrowserInfo {
  name: BrowserType;
  displayName: string;
  description: string;
  color: string;
  icon: string;
  supported: boolean;
}

export interface BrowserConfiguration {
  selectedBrowsers: Record<BrowserType, boolean>;
  projectConfig: Array<{
    name: string;
    use: Record<string, any>;
  }>;
}

export interface GeneratedBrowserConfig {
  projects: Array<{
    name: string;
    use: {
      browserName: string;
      [key: string]: any;
    };
  }>;
  scripts: Record<string, string>;
  dependencies: string[];
}