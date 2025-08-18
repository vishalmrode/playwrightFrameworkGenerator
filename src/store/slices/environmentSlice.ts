import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnvironmentState, EnvironmentConfig, DEFAULT_ENVIRONMENTS } from '@/types/environment';

const initialState: EnvironmentState = {
  environments: DEFAULT_ENVIRONMENTS,
  // default to selecting the development environment if present
  selectedEnvironments: DEFAULT_ENVIRONMENTS.some(e => e.name === 'development') ? ['development'] : [],
};

const environmentSlice = createSlice({
  name: 'environment',
  initialState,
  reducers: {
    addEnvironment: (state, action: PayloadAction<EnvironmentConfig>) => {
      state.environments.push(action.payload);
    },
    updateEnvironment: (state, action: PayloadAction<{ index: number; environment: EnvironmentConfig }>) => {
      const { index, environment } = action.payload;
      if (index >= 0 && index < state.environments.length) {
        state.environments[index] = environment;
      }
    },
    removeEnvironment: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.environments.length) {
        const removedEnv = state.environments[index];
        state.environments.splice(index, 1);
        // Remove from selectedEnvironments if it was selected
        state.selectedEnvironments = state.selectedEnvironments.filter(name => name !== removedEnv.name);
        // If nothing remains selected, pick the first environment if available
        if (state.selectedEnvironments.length === 0 && state.environments.length > 0) {
          state.selectedEnvironments = [state.environments[0].name];
        }
      }
    },
    // toggle selection for multi-select environments
    toggleEnvironmentSelection: (state, action: PayloadAction<string>) => {
      const name = action.payload;
      const exists = state.environments.some(env => env.name === name);
      if (!exists) return;
      const idx = state.selectedEnvironments.indexOf(name);
      if (idx === -1) state.selectedEnvironments.push(name);
      else state.selectedEnvironments.splice(idx, 1);
      // Ensure at least one selection: if none selected, pick first environment
      if (state.selectedEnvironments.length === 0 && state.environments.length > 0) {
        state.selectedEnvironments = [state.environments[0].name];
      }
    },
    setSelectedEnvironments: (state, action: PayloadAction<string[]>) => {
      // Filter to valid environment names
      const valid = action.payload.filter(name => state.environments.some(e => e.name === name));
      state.selectedEnvironments = valid.length > 0 ? valid : (state.environments.length > 0 ? [state.environments[0].name] : []);
    },
    resetEnvironments: (state) => {
      state.environments = DEFAULT_ENVIRONMENTS;
      state.selectedEnvironments = DEFAULT_ENVIRONMENTS.some(e => e.name === 'development') ? ['development'] : [];
    },
  },
});

export const {
  addEnvironment,
  updateEnvironment,
  removeEnvironment,
  resetEnvironments,
} = environmentSlice.actions;

export const {
  toggleEnvironmentSelection,
  setSelectedEnvironments,
} = environmentSlice.actions as any;

export default environmentSlice.reducer;