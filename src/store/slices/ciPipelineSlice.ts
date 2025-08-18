import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  CIPipelineState, 
  WorkflowConfig,
  GlobalCISettings,
  TriggerConfig,
  ExecutionStrategy,
  RetryStrategy,
  EnvironmentMatrix,
  ReportingConfig,
  ArtifactConfig,
  NotificationConfig,
  SecurityConfig,
  DEFAULT_CI_PIPELINE_STATE,
  DEFAULT_WORKFLOW_CONFIG
} from '@/types/ciPipeline';

// Load CI pipeline configuration from localStorage with fallback to defaults
const loadCIPipelineFromStorage = (): CIPipelineState => {
  try {
    const storedConfig = localStorage.getItem('playwright-generator-ci-pipeline');
    if (storedConfig) {
      const parsed = JSON.parse(storedConfig);
      // Merge with defaults to ensure all properties exist
      return {
        enabled: parsed.enabled ?? DEFAULT_CI_PIPELINE_STATE.enabled,
        workflows: parsed.workflows?.length > 0 ? parsed.workflows : DEFAULT_CI_PIPELINE_STATE.workflows,
        selectedWorkflowIndex: parsed.selectedWorkflowIndex ?? DEFAULT_CI_PIPELINE_STATE.selectedWorkflowIndex,
        globalSettings: { ...DEFAULT_CI_PIPELINE_STATE.globalSettings, ...parsed.globalSettings },
      };
    }
  } catch (error) {
    console.warn('Failed to load CI pipeline configuration from localStorage:', error);
  }
  return DEFAULT_CI_PIPELINE_STATE;
};

// Save CI pipeline configuration to localStorage
const saveCIPipelineToStorage = (config: CIPipelineState): void => {
  try {
    localStorage.setItem('playwright-generator-ci-pipeline', JSON.stringify(config));
  } catch (error) {
    console.warn('Failed to save CI pipeline configuration to localStorage:', error);
  }
};

const initialState: CIPipelineState = loadCIPipelineFromStorage();

const ciPipelineSlice = createSlice({
  name: 'ciPipeline',
  initialState,
  reducers: {
    setCIEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
      saveCIPipelineToStorage(state);
    },
    
    addWorkflow: (state, action: PayloadAction<Partial<WorkflowConfig>>) => {
      const newWorkflow: WorkflowConfig = {
        ...DEFAULT_WORKFLOW_CONFIG,
        ...action.payload,
        id: action.payload.id || `workflow-${Date.now()}`,
      };
      state.workflows.push(newWorkflow);
      state.selectedWorkflowIndex = state.workflows.length - 1;
      saveCIPipelineToStorage(state);
    },
    
    updateWorkflow: (state, action: PayloadAction<{ index: number; workflow: Partial<WorkflowConfig> }>) => {
      const { index, workflow } = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.workflows[index] = { ...state.workflows[index], ...workflow };
        saveCIPipelineToStorage(state);
      }
    },
    
    removeWorkflow: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.workflows.length && state.workflows.length > 1) {
        state.workflows.splice(index, 1);
        if (state.selectedWorkflowIndex >= state.workflows.length) {
          state.selectedWorkflowIndex = state.workflows.length - 1;
        }
        saveCIPipelineToStorage(state);
      }
    },
    
    selectWorkflow: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.selectedWorkflowIndex = index;
        saveCIPipelineToStorage(state);
      }
    },
    
    updateWorkflowTriggers: (state, action: PayloadAction<{ index: number; triggers: Partial<TriggerConfig> }>) => {
      const { index, triggers } = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.workflows[index].triggers = { ...state.workflows[index].triggers, ...triggers };
        saveCIPipelineToStorage(state);
      }
    },
    
    updateWorkflowExecution: (state, action: PayloadAction<{ index: number; execution: Partial<ExecutionStrategy> }>) => {
      const { index, execution } = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.workflows[index].executionStrategy = { ...state.workflows[index].executionStrategy, ...execution };
        saveCIPipelineToStorage(state);
      }
    },
    
    updateWorkflowRetry: (state, action: PayloadAction<{ index: number; retry: Partial<RetryStrategy> }>) => {
      const { index, retry } = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.workflows[index].retryStrategy = { ...state.workflows[index].retryStrategy, ...retry };
        saveCIPipelineToStorage(state);
      }
    },
    
    updateWorkflowEnvironments: (state, action: PayloadAction<{ index: number; environments: Partial<EnvironmentMatrix> }>) => {
      const { index, environments } = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.workflows[index].environments = { ...state.workflows[index].environments, ...environments };
        saveCIPipelineToStorage(state);
      }
    },
    
    updateWorkflowReporting: (state, action: PayloadAction<{ index: number; reporting: Partial<ReportingConfig> }>) => {
      const { index, reporting } = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.workflows[index].reporting = { ...state.workflows[index].reporting, ...reporting };
        saveCIPipelineToStorage(state);
      }
    },
    
    updateWorkflowArtifacts: (state, action: PayloadAction<{ index: number; artifacts: Partial<ArtifactConfig> }>) => {
      const { index, artifacts } = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.workflows[index].artifacts = { ...state.workflows[index].artifacts, ...artifacts };
        saveCIPipelineToStorage(state);
      }
    },
    
    updateWorkflowNotifications: (state, action: PayloadAction<{ index: number; notifications: Partial<NotificationConfig> }>) => {
      const { index, notifications } = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.workflows[index].notifications = { ...state.workflows[index].notifications, ...notifications };
        saveCIPipelineToStorage(state);
      }
    },
    
    updateWorkflowSecurity: (state, action: PayloadAction<{ index: number; security: Partial<SecurityConfig> }>) => {
      const { index, security } = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        state.workflows[index].security = { ...state.workflows[index].security, ...security };
        saveCIPipelineToStorage(state);
      }
    },
    
    updateGlobalSettings: (state, action: PayloadAction<Partial<GlobalCISettings>>) => {
      state.globalSettings = { ...state.globalSettings, ...action.payload };
      saveCIPipelineToStorage(state);
    },
    
    duplicateWorkflow: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.workflows.length) {
        const workflowToDuplicate = state.workflows[index];
        const duplicatedWorkflow: WorkflowConfig = {
          ...workflowToDuplicate,
          id: `workflow-${Date.now()}`,
          name: `${workflowToDuplicate.name} (Copy)`,
          // If the description matches the default example text, drop it for duplicates
          description: workflowToDuplicate.description === DEFAULT_WORKFLOW_CONFIG.description
            ? undefined
            : workflowToDuplicate.description,
        };
        state.workflows.push(duplicatedWorkflow);
        state.selectedWorkflowIndex = state.workflows.length - 1;
        saveCIPipelineToStorage(state);
      }
    },
    
    resetCIPipelineConfig: (state) => {
      Object.assign(state, DEFAULT_CI_PIPELINE_STATE);
      saveCIPipelineToStorage(state);
    },
  },
});

export const {
  setCIEnabled,
  addWorkflow,
  updateWorkflow,
  removeWorkflow,
  selectWorkflow,
  updateWorkflowTriggers,
  updateWorkflowExecution,
  updateWorkflowRetry,
  updateWorkflowEnvironments,
  updateWorkflowReporting,
  updateWorkflowArtifacts,
  updateWorkflowNotifications,
  updateWorkflowSecurity,
  updateGlobalSettings,
  duplicateWorkflow,
  resetCIPipelineConfig,
} = ciPipelineSlice.actions;

export default ciPipelineSlice.reducer;