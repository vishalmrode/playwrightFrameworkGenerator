import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TestingCapabilities, TestingCapabilityType } from '@/types/testingCapabilities';

const initialState: TestingCapabilities = {
  uiTesting: true,
  apiTesting: true,
  visualTesting: false,
  accessibilityTesting: false,
  performanceTesting: false,
  crossBrowserTesting: true,
};

const testingCapabilitiesSlice = createSlice({
  name: 'testingCapabilities',
  initialState,
  reducers: {
    toggleTestingCapability: (
      state,
      action: PayloadAction<{ type: TestingCapabilityType; enabled: boolean }>
    ) => {
      const { type, enabled } = action.payload;
      state[type] = enabled;
    },
    setAllTestingCapabilities: (_state, action: PayloadAction<TestingCapabilities>) => {
      return action.payload;
    },
    resetTestingCapabilities: () => {
      return initialState;
    },
  },
});

export const {
  toggleTestingCapability,
  setAllTestingCapabilities,
  resetTestingCapabilities,
} = testingCapabilitiesSlice.actions;

export default testingCapabilitiesSlice.reducer;