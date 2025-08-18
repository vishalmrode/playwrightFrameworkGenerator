import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Theme = 'system' | 'light' | 'dark';

interface UiState {
  theme: Theme;
}

// Load theme from localStorage with fallback to 'system'
const loadThemeFromStorage = (): Theme => {
  try {
    const storedTheme = localStorage.getItem('vite-ui-theme');
    if (storedTheme && ['system', 'light', 'dark'].includes(storedTheme)) {
      return storedTheme as Theme;
    }
  } catch (error) {
    console.warn('Failed to load theme from localStorage:', error);
  }
  return 'system';
};

// Save theme to localStorage
const saveThemeToStorage = (theme: Theme): void => {
  try {
    localStorage.setItem('vite-ui-theme', theme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
};

const initialState: UiState = {
  theme: loadThemeFromStorage(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      saveThemeToStorage(action.payload);
    },
  },
});

export const { setTheme } = uiSlice.actions;
export default uiSlice.reducer; 