/**
 * fixturesSlice.ts
 * Purpose: Redux slice managing test fixtures configuration used by the
 * generator (page object patterns, setup/teardown patterns, authentication
 * fixtures, custom utilities and related settings).
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  FixturesState,
  DEFAULT_PAGE_OBJECT_PATTERNS,
  DEFAULT_SETUP_TEARDOWN_PATTERNS,
  DEFAULT_AUTHENTICATION_FIXTURES,
  DEFAULT_CUSTOM_FIXTURES,
  DEFAULT_TEST_DATA_STRATEGY,
} from '@/types/fixtures';
import type { TestDataStrategy, AuthenticationFixture, FixtureOption } from '@/types/fixtures';

const initialState: FixturesState = {
  pageObjectPatterns: DEFAULT_PAGE_OBJECT_PATTERNS,
  testDataStrategy: DEFAULT_TEST_DATA_STRATEGY,
  setupTeardownPatterns: DEFAULT_SETUP_TEARDOWN_PATTERNS,
  authenticationFixtures: DEFAULT_AUTHENTICATION_FIXTURES,
  customFixtures: DEFAULT_CUSTOM_FIXTURES,
  reusableComponents: true,
  globalFixtures: true,
  fixtureTimeout: 30000,
  parallelSafe: true,
};

const fixturesSlice = createSlice({
  name: 'fixtures',
  initialState,
  reducers: {
    togglePageObjectPattern: (state, action: PayloadAction<string>) => {
      const pattern = state.pageObjectPatterns.find(p => p.id === action.payload);
      if (pattern) {
        pattern.enabled = !pattern.enabled;
      }
    },
    
    updateTestDataStrategy: (state, action: PayloadAction<Partial<TestDataStrategy>>) => {
      state.testDataStrategy = { ...state.testDataStrategy, ...action.payload };
    },
    
    toggleSetupTeardownPattern: (state, action: PayloadAction<string>) => {
      const pattern = state.setupTeardownPatterns.find(p => p.id === action.payload);
      if (pattern) {
        pattern.enabled = !pattern.enabled;
      }
    },
    
    toggleAuthenticationFixture: (state, action: PayloadAction<string>) => {
      const fixture = state.authenticationFixtures.find(f => f.id === action.payload);
      if (fixture) {
        fixture.enabled = !fixture.enabled;
      }
    },
    
    updateAuthenticationFixture: (state, action: PayloadAction<{ id: string; updates: Partial<AuthenticationFixture> }>) => {
      const { id, updates } = action.payload;
      const fixture = state.authenticationFixtures.find(f => f.id === id);
      if (fixture) {
        Object.assign(fixture, updates);
      }
    },
    
    toggleCustomFixture: (state, action: PayloadAction<string>) => {
      const fixture = state.customFixtures.find(f => f.id === action.payload);
      if (fixture) {
        fixture.enabled = !fixture.enabled;
      }
    },
    
    addCustomFixture: (state, action: PayloadAction<FixtureOption>) => {
      state.customFixtures.push(action.payload);
    },
    
    removeCustomFixture: (state, action: PayloadAction<string>) => {
      state.customFixtures = state.customFixtures.filter(f => f.id !== action.payload);
    },
    
    updateFixtureSettings: (state, action: PayloadAction<{
      reusableComponents?: boolean;
      globalFixtures?: boolean;
      fixtureTimeout?: number;
      parallelSafe?: boolean;
    }>) => {
      Object.assign(state, action.payload);
    },
    
    resetFixturesConfiguration: () => {
      return initialState;
    },
    
    bulkToggleFixtures: (state, action: PayloadAction<{
      category: 'pageObjects' | 'setupTeardown' | 'authentication' | 'custom';
      enabled: boolean;
    }>) => {
      const { category, enabled } = action.payload;
      
      switch (category) {
        case 'pageObjects':
          state.pageObjectPatterns.forEach(pattern => {
            pattern.enabled = enabled;
          });
          break;
        case 'setupTeardown':
          state.setupTeardownPatterns.forEach(pattern => {
            pattern.enabled = enabled;
          });
          break;
        case 'authentication':
          state.authenticationFixtures.forEach(fixture => {
            fixture.enabled = enabled;
          });
          break;
        case 'custom':
          state.customFixtures.forEach(fixture => {
            fixture.enabled = enabled;
          });
          break;
      }
    },
    
    setPreset: (state, action: PayloadAction<'minimal' | 'standard' | 'comprehensive'>) => {
      const preset = action.payload;
      
      // Reset all to disabled first
      state.pageObjectPatterns.forEach(p => p.enabled = false);
      state.setupTeardownPatterns.forEach(p => p.enabled = false);
      state.authenticationFixtures.forEach(f => f.enabled = false);
      state.customFixtures.forEach(f => f.enabled = false);
      
      switch (preset) {
        case 'minimal':
          // Enable only basic patterns
          state.pageObjectPatterns.find(p => p.id === 'base-page')!.enabled = true;
          state.setupTeardownPatterns.find(p => p.id === 'test-isolation')!.enabled = true;
          state.testDataStrategy.strategy = 'isolated';
          state.reusableComponents = false;
          state.globalFixtures = false;
          break;
          
        case 'standard':
          // Enable commonly used patterns
          state.pageObjectPatterns.find(p => p.id === 'base-page')!.enabled = true;
          state.pageObjectPatterns.find(p => p.id === 'component-page')!.enabled = true;
          state.setupTeardownPatterns.find(p => p.id === 'global-setup')!.enabled = true;
          state.setupTeardownPatterns.find(p => p.id === 'test-isolation')!.enabled = true;
          state.setupTeardownPatterns.find(p => p.id === 'data-cleanup')!.enabled = true;
          state.authenticationFixtures.find(f => f.id === 'login-fixture')!.enabled = true;
          state.testDataStrategy.strategy = 'isolated';
          state.reusableComponents = true;
          state.globalFixtures = true;
          break;
          
        case 'comprehensive':
          // Enable all non-advanced patterns
          state.pageObjectPatterns.forEach(p => {
            if (!p.id.includes('factory') && !p.id.includes('fluent')) {
              p.enabled = true;
            }
          });
          state.setupTeardownPatterns.forEach(p => p.enabled = true);
          state.authenticationFixtures.forEach(f => {
            if (!f.id.includes('api-token')) {
              f.enabled = true;
            }
          });
          state.customFixtures.forEach(f => {
            if (!f.advanced) {
              f.enabled = true;
            }
          });
          state.testDataStrategy.strategy = 'factory';
          state.reusableComponents = true;
          state.globalFixtures = true;
          state.parallelSafe = true;
          break;
      }
    },
  },
});

export const {
  togglePageObjectPattern,
  updateTestDataStrategy,
  toggleSetupTeardownPattern,
  toggleAuthenticationFixture,
  updateAuthenticationFixture,
  toggleCustomFixture,
  addCustomFixture,
  removeCustomFixture,
  updateFixtureSettings,
  resetFixturesConfiguration,
  bulkToggleFixtures,
  setPreset,
} = fixturesSlice.actions;

export default fixturesSlice.reducer;