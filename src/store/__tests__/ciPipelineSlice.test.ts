import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, {
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
} from '../slices/ciPipelineSlice';
import {
  DEFAULT_CI_PIPELINE_STATE,
} from '@/types/ciPipeline';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage
});

describe('ciPipelineSlice', () => {
  let initialState: typeof DEFAULT_CI_PIPELINE_STATE;

  beforeEach(() => {
    initialState = JSON.parse(JSON.stringify(DEFAULT_CI_PIPELINE_STATE));
    vi.clearAllMocks();
  });

  it('should handle setCIEnabled', () => {
    const state = reducer(initialState, setCIEnabled(true));
    expect(state.enabled).toBe(true);
  });

  it('should add a workflow', () => {
    const state = reducer(initialState, addWorkflow({ name: 'My Workflow' }));
    expect(state.workflows.length).toBe(initialState.workflows.length + 1);
    expect(state.workflows[state.workflows.length - 1].name).toBe('My Workflow');
    expect(state.selectedWorkflowIndex).toBe(state.workflows.length - 1);
  });

  it('should update a workflow', () => {
    const stateWithWorkflow = reducer(initialState, addWorkflow({ name: 'Test' }));
    const state = reducer(
      stateWithWorkflow,
      updateWorkflow({ index: 0, workflow: { name: 'Updated' } })
    );
    expect(state.workflows[0].name).toBe('Updated');
  });

  it('should remove a workflow (not if only one left)', () => {
    const state = reducer(initialState, removeWorkflow(0));
    expect(state.workflows.length).toBe(1); // Should not remove if only one
    const stateWithTwo = reducer(initialState, addWorkflow({ name: 'Second' }));
    const removed = reducer(stateWithTwo, removeWorkflow(1));
    expect(removed.workflows.length).toBe(1);
  });

  it('should select a workflow', () => {
    const stateWithTwo = reducer(initialState, addWorkflow({ name: 'Second' }));
    const state = reducer(stateWithTwo, selectWorkflow(1));
    expect(state.selectedWorkflowIndex).toBe(1);
  });

  it('should update workflow triggers', () => {
    const state = reducer(
      initialState,
      updateWorkflowTriggers({ index: 0, triggers: { push: { enabled: true, branches: [] } } })
    );
    expect(state.workflows[0].triggers.push.enabled).toBe(true);
  });

  it('should update workflow execution', () => {
    const state = reducer(
      initialState,
      updateWorkflowExecution({ index: 0, execution: { parallelism: 5 } })
    );
    expect(state.workflows[0].executionStrategy.parallelism).toBe(5);
  });

  it('should update workflow retry', () => {
    const state = reducer(
      initialState,
      updateWorkflowRetry({ index: 0, retry: { maxAttempts: 3 } })
    );
    expect(state.workflows[0].retryStrategy.maxAttempts).toBe(3);
  });

  it('should update workflow environments', () => {
    const state = reducer(
      initialState,
      updateWorkflowEnvironments({ index: 0, environments: { operatingSystems: ['ubuntu-latest'] } })
    );
    expect(state.workflows[0].environments.operatingSystems).toContain('ubuntu-latest');
  });

  it('should update workflow reporting', () => {
    const state = reducer(
      initialState,
      updateWorkflowReporting({ index: 0, reporting: { junit: { enabled: true, outputPath: 'test-results/junit.xml' } } })
    );
    expect(state.workflows[0].reporting.junit.enabled).toBe(true);
  });

  it('should update workflow artifacts', () => {
    const state = reducer(
      initialState,
      updateWorkflowArtifacts({ index: 0, artifacts: { testResults: { enabled: true, retention: 90 } } })
    );
    expect(state.workflows[0].artifacts.testResults.enabled).toBe(true);
    expect(state.workflows[0].artifacts.testResults.retention).toBe(90);
  });

  it('should update workflow notifications', () => {
    const state = reducer(
      initialState,
      updateWorkflowNotifications({ index: 0, notifications: { email: { enabled: true, recipients: ['test@example.com'], onSuccess: true, onFailure: true } } })
    );
    expect(state.workflows[0].notifications.email.enabled).toBe(true);
    expect(state.workflows[0].notifications.email.recipients).toContain('test@example.com');
  });

  it('should update workflow security', () => {
    const state = reducer(
      initialState,
      updateWorkflowSecurity({ index: 0, security: { secretScanning: true, dependencyCheck: false } })
    );
    expect(state.workflows[0].security.secretScanning).toBe(true);
    expect(state.workflows[0].security.dependencyCheck).toBe(false);
  });

  it('should update global settings', () => {
    const state = reducer(
      initialState,
      updateGlobalSettings({ defaultTimeout: 60, enableDebugLogging: true })
    );
    expect(state.globalSettings.defaultTimeout).toBe(60);
    expect(state.globalSettings.enableDebugLogging).toBe(true);
  });

  it('should duplicate a workflow', () => {
    const stateWithTwo = reducer(initialState, addWorkflow({ name: 'Second' }));
    const state = reducer(stateWithTwo, duplicateWorkflow(1));
    expect(state.workflows.length).toBe(3);
    expect(state.workflows[2].name).toContain('Copy');
    expect(state.selectedWorkflowIndex).toBe(2);
  });

  it('should reset CI pipeline config', () => {
    let state = reducer(initialState, setCIEnabled(true));
    state = reducer(state, addWorkflow({ name: 'Another' }));
    state = reducer(state, resetCIPipelineConfig());
    expect(state).toEqual(DEFAULT_CI_PIPELINE_STATE);
  });

  it('should handle basic workflow operations', () => {
    let state = initialState;
    
    // Enable CI
    state = reducer(state, setCIEnabled(true));
    expect(state.enabled).toBe(true);
    
    // Add workflow
    state = reducer(state, addWorkflow({ name: 'Test Workflow' }));
    expect(state.workflows.length).toBeGreaterThan(1);
    expect(state.workflows[state.workflows.length - 1].name).toBe('Test Workflow');
    
    // Update workflow
    state = reducer(state, updateWorkflow({ index: 0, workflow: { name: 'Updated Workflow' } }));
    expect(state.workflows[0].name).toBe('Updated Workflow');
  });
});