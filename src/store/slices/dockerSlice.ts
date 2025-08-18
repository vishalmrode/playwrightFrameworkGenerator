import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DockerState,
  DockerConfig,
  DockerBaseImage,
  DockerFeatures,
  DockerResources,
  DockerMemoryLimit,
  DockerCpuLimit,
  DEFAULT_DOCKER_CONFIG,
} from '@/types/docker';

// Load Docker configuration from localStorage with fallback to defaults
const loadDockerConfigFromStorage = (): DockerConfig => {
  try {
    const storedConfig = localStorage.getItem('playwright-generator-docker');
    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      // Merge with defaults to ensure all properties exist
      return {
        ...DEFAULT_DOCKER_CONFIG,
        ...parsed,
        features: {
          ...DEFAULT_DOCKER_CONFIG.features,
          ...parsed.features,
        },
        resources: {
          ...DEFAULT_DOCKER_CONFIG.resources,
          ...parsed.resources,
        },
      };
    }
  } catch (error) {
    console.warn('Failed to load Docker config from localStorage:', error);
  }
  return DEFAULT_DOCKER_CONFIG;
};

// Save Docker configuration to localStorage
const saveDockerConfigToStorage = (config: DockerConfig): void => {
  try {
    localStorage.setItem('playwright-generator-docker', JSON.stringify(config));
  } catch (error) {
    console.warn('Failed to save Docker config to localStorage:', error);
  }
};

const initialState: DockerState = {
  config: loadDockerConfigFromStorage(),
};

const dockerSlice = createSlice({
  name: 'docker',
  initialState,
  reducers: {
    setDockerEnabled: (state, action: PayloadAction<boolean>) => {
      state.config.enabled = action.payload;
      saveDockerConfigToStorage(state.config);
    },
    
    setBaseImage: (state, action: PayloadAction<DockerBaseImage>) => {
      state.config.baseImage = action.payload;
      // Clear custom image if not using custom base
      if (action.payload !== 'custom') {
        state.config.customImage = undefined;
      }
      saveDockerConfigToStorage(state.config);
    },
    
    setCustomImage: (state, action: PayloadAction<string | undefined>) => {
      state.config.customImage = action.payload;
      saveDockerConfigToStorage(state.config);
    },
    
    toggleDockerFeature: (state, action: PayloadAction<keyof DockerFeatures>) => {
      const feature = action.payload;
      state.config.features[feature] = !state.config.features[feature];
      saveDockerConfigToStorage(state.config);
    },
    
    setDockerFeatures: (state, action: PayloadAction<Partial<DockerFeatures>>) => {
      state.config.features = { ...state.config.features, ...action.payload };
      saveDockerConfigToStorage(state.config);
    },
    
    setMemoryLimit: (state, action: PayloadAction<DockerMemoryLimit>) => {
      state.config.resources.memoryLimit = action.payload;
      saveDockerConfigToStorage(state.config);
    },
    
    setCpuLimit: (state, action: PayloadAction<DockerCpuLimit>) => {
      state.config.resources.cpuLimit = action.payload;
      saveDockerConfigToStorage(state.config);
    },
    
    setDockerResources: (state, action: PayloadAction<Partial<DockerResources>>) => {
      state.config.resources = { ...state.config.resources, ...action.payload };
      saveDockerConfigToStorage(state.config);
    },
    
    updateDockerConfig: (state, action: PayloadAction<Partial<DockerConfig>>) => {
      state.config = {
        ...state.config,
        ...action.payload,
        features: {
          ...state.config.features,
          ...action.payload.features,
        },
        resources: {
          ...state.config.resources,
          ...action.payload.resources,
        },
      };
      saveDockerConfigToStorage(state.config);
    },
    
    resetDockerConfig: (state) => {
      state.config = DEFAULT_DOCKER_CONFIG;
      saveDockerConfigToStorage(state.config);
    },
  },
});

export const {
  setDockerEnabled,
  setBaseImage,
  setCustomImage,
  toggleDockerFeature,
  setDockerFeatures,
  setMemoryLimit,
  setCpuLimit,
  setDockerResources,
  updateDockerConfig,
  resetDockerConfig,
} = dockerSlice.actions;

export default dockerSlice.reducer;