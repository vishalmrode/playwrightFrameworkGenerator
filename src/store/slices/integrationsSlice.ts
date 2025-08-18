import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  IntegrationsState, 
  GitHubActionsConfig, 
  AllureReporterConfig, 
  CucumberIntegrationConfig, 
  FakerLibraryConfig,
  DEFAULT_INTEGRATIONS_STATE 
} from '@/types/integrations';

// Load integrations from localStorage with fallback to defaults
const loadIntegrationsFromStorage = (): IntegrationsState => {
  try {
    const storedIntegrations = localStorage.getItem('playwright-generator-integrations');
    if (storedIntegrations) {
      const parsed = JSON.parse(storedIntegrations);
      // Merge with defaults to ensure all properties exist
      return {
        githubActions: { ...DEFAULT_INTEGRATIONS_STATE.githubActions, ...parsed.githubActions },
        allureReporter: { ...DEFAULT_INTEGRATIONS_STATE.allureReporter, ...parsed.allureReporter },
        cucumberIntegration: { ...DEFAULT_INTEGRATIONS_STATE.cucumberIntegration, ...parsed.cucumberIntegration },
        fakerLibrary: { ...DEFAULT_INTEGRATIONS_STATE.fakerLibrary, ...parsed.fakerLibrary },
      };
    }
  } catch (error) {
    console.warn('Failed to load integrations from localStorage:', error);
  }
  return DEFAULT_INTEGRATIONS_STATE;
};

// Save integrations to localStorage
const saveIntegrationsToStorage = (integrations: IntegrationsState): void => {
  try {
    localStorage.setItem('playwright-generator-integrations', JSON.stringify(integrations));
  } catch (error) {
    console.warn('Failed to save integrations to localStorage:', error);
  }
};

const initialState: IntegrationsState = loadIntegrationsFromStorage();

const integrationsSlice = createSlice({
  name: 'integrations',
  initialState,
  reducers: {
    setGitHubActionsConfig: (state, action: PayloadAction<Partial<GitHubActionsConfig>>) => {
      state.githubActions = { ...state.githubActions, ...action.payload };
      saveIntegrationsToStorage(state);
    },
    setAllureReporterConfig: (state, action: PayloadAction<Partial<AllureReporterConfig>>) => {
      state.allureReporter = { ...state.allureReporter, ...action.payload };
      saveIntegrationsToStorage(state);
    },
    setCucumberIntegrationConfig: (state, action: PayloadAction<Partial<CucumberIntegrationConfig>>) => {
      state.cucumberIntegration = { ...state.cucumberIntegration, ...action.payload };
      saveIntegrationsToStorage(state);
    },
    setFakerLibraryConfig: (state, action: PayloadAction<Partial<FakerLibraryConfig>>) => {
      state.fakerLibrary = { ...state.fakerLibrary, ...action.payload };
      saveIntegrationsToStorage(state);
    },
    resetIntegrationsConfig: (state) => {
      Object.assign(state, DEFAULT_INTEGRATIONS_STATE);
      saveIntegrationsToStorage(state);
    },
  },
});

export const {
  setGitHubActionsConfig,
  setAllureReporterConfig,
  setCucumberIntegrationConfig,
  setFakerLibraryConfig,
  resetIntegrationsConfig,
} = integrationsSlice.actions;

export default integrationsSlice.reducer;