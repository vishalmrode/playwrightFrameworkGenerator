import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProgrammingLanguage } from '@/types/language';

interface LanguageState {
  selectedLanguage: ProgrammingLanguage;
}

// Load language from localStorage with fallback to 'typescript'
const loadLanguageFromStorage = (): ProgrammingLanguage => {
  try {
    const storedLanguage = localStorage.getItem('playwright-generator-language');
    if (storedLanguage && ['typescript', 'javascript'].includes(storedLanguage)) {
      return storedLanguage as ProgrammingLanguage;
    }
  } catch (error) {
    console.warn('Failed to load language from localStorage:', error);
  }
  return 'typescript';
};

// Save language to localStorage
const saveLanguageToStorage = (language: ProgrammingLanguage): void => {
  try {
    localStorage.setItem('playwright-generator-language', language);
  } catch (error) {
    console.warn('Failed to save language to localStorage:', error);
  }
};

const initialState: LanguageState = {
  selectedLanguage: loadLanguageFromStorage(),
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setSelectedLanguage: (state, action: PayloadAction<ProgrammingLanguage>) => {
      state.selectedLanguage = action.payload;
      saveLanguageToStorage(action.payload);
    },
  },
});

export const { setSelectedLanguage } = languageSlice.actions;
export default languageSlice.reducer;