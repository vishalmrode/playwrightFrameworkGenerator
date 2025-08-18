import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BrowserState {
  selectedBrowsers: {
    chromium: boolean;
    firefox: boolean;
    webkit: boolean;
  };
}

const initialState: BrowserState = {
  selectedBrowsers: {
    chromium: true,
    firefox: true,
    webkit: true, // Safari uses WebKit
  },
};

const browserSlice = createSlice({
  name: 'browser',
  initialState,
  reducers: {
    toggleBrowser: (state, action: PayloadAction<'chromium' | 'firefox' | 'webkit'>) => {
      const browser = action.payload;
      state.selectedBrowsers[browser] = !state.selectedBrowsers[browser];
    },
    setBrowsers: (state, action: PayloadAction<Partial<BrowserState['selectedBrowsers']>>) => {
      state.selectedBrowsers = { ...state.selectedBrowsers, ...action.payload };
    },
    selectAllBrowsers: (state) => {
      state.selectedBrowsers.chromium = true;
      state.selectedBrowsers.firefox = true;
      state.selectedBrowsers.webkit = true;
    },
    deselectAllBrowsers: (state) => {
      state.selectedBrowsers.chromium = false;
      state.selectedBrowsers.firefox = false;
      state.selectedBrowsers.webkit = false;
    },
  },
});

export const { toggleBrowser, setBrowsers, selectAllBrowsers, deselectAllBrowsers } = browserSlice.actions;
export default browserSlice.reducer;