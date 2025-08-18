import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CodeQualitySettings, ESLintConfig, PrettierConfig, TypeScriptTarget } from '@/types/codeQuality';

export interface CodeQualityState {
  settings: CodeQualitySettings;
}

const initialState: CodeQualityState = {
  settings: {
    eslint: {
      enabled: true,
      config: 'recommended',
      plugins: ['@typescript-eslint', '@playwright/recommended'],
      customRules: {},
    },
    prettier: {
      enabled: true,
      config: 'default',
      tabWidth: 2,
      semi: true,
      singleQuote: false,
      trailingComma: 'es5',
      printWidth: 80,
    },
    typescript: {
      strict: true,
      target: 'es2022',
      exactOptionalPropertyTypes: false,
      noUncheckedIndexedAccess: false,
      noImplicitOverride: false,
    },
  },
};

const codeQualitySlice = createSlice({
  name: 'codeQuality',
  initialState,
  reducers: {
    // ESLint actions
    toggleESLint: (state) => {
      state.settings.eslint.enabled = !state.settings.eslint.enabled;
    },
    setESLintConfig: (state, action: PayloadAction<ESLintConfig>) => {
      state.settings.eslint.config = action.payload;
    },
    addESLintPlugin: (state, action: PayloadAction<string>) => {
      if (!state.settings.eslint.plugins.includes(action.payload)) {
        state.settings.eslint.plugins.push(action.payload);
      }
    },
    removeESLintPlugin: (state, action: PayloadAction<string>) => {
      state.settings.eslint.plugins = state.settings.eslint.plugins.filter(
        plugin => plugin !== action.payload
      );
    },
    setESLintCustomRules: (state, action: PayloadAction<Record<string, any>>) => {
      state.settings.eslint.customRules = action.payload;
    },

    // Prettier actions
    togglePrettier: (state) => {
      state.settings.prettier.enabled = !state.settings.prettier.enabled;
    },
    setPrettierConfig: (state, action: PayloadAction<PrettierConfig>) => {
      state.settings.prettier.config = action.payload;
    },
    setPrettierTabWidth: (state, action: PayloadAction<number>) => {
      state.settings.prettier.tabWidth = action.payload;
    },
    togglePrettierSemi: (state) => {
      state.settings.prettier.semi = !state.settings.prettier.semi;
    },
    togglePrettierSingleQuote: (state) => {
      state.settings.prettier.singleQuote = !state.settings.prettier.singleQuote;
    },
    setPrettierTrailingComma: (state, action: PayloadAction<'none' | 'es5' | 'all'>) => {
      state.settings.prettier.trailingComma = action.payload;
    },
    setPrettierPrintWidth: (state, action: PayloadAction<number>) => {
      state.settings.prettier.printWidth = action.payload;
    },
    setPrettierSettings: (state, action: PayloadAction<Partial<CodeQualitySettings['prettier']>>) => {
      state.settings.prettier = { ...state.settings.prettier, ...action.payload };
    },

    // TypeScript actions
    toggleTypeScriptStrict: (state) => {
      state.settings.typescript.strict = !state.settings.typescript.strict;
    },
    setTypeScriptTarget: (state, action: PayloadAction<TypeScriptTarget>) => {
      state.settings.typescript.target = action.payload;
    },
    toggleExactOptionalPropertyTypes: (state) => {
      state.settings.typescript.exactOptionalPropertyTypes = !state.settings.typescript.exactOptionalPropertyTypes;
    },
    toggleNoUncheckedIndexedAccess: (state) => {
      state.settings.typescript.noUncheckedIndexedAccess = !state.settings.typescript.noUncheckedIndexedAccess;
    },
    toggleNoImplicitOverride: (state) => {
      state.settings.typescript.noImplicitOverride = !state.settings.typescript.noImplicitOverride;
    },

    // Bulk actions
    setCodeQualitySettings: (state, action: PayloadAction<Partial<CodeQualitySettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    resetToDefaults: (state) => {
      state.settings = initialState.settings;
    },
  },
});

export const {
  // ESLint actions
  toggleESLint,
  setESLintConfig,
  addESLintPlugin,
  removeESLintPlugin,
  setESLintCustomRules,
  
  // Prettier actions
  togglePrettier,
  setPrettierConfig,
  setPrettierTabWidth,
  togglePrettierSemi,
  togglePrettierSingleQuote,
  setPrettierTrailingComma,
  setPrettierPrintWidth,
  setPrettierSettings,
  
  // TypeScript actions
  toggleTypeScriptStrict,
  setTypeScriptTarget,
  toggleExactOptionalPropertyTypes,
  toggleNoUncheckedIndexedAccess,
  toggleNoImplicitOverride,
  
  // Bulk actions
  setCodeQualitySettings,
  resetToDefaults,
} = codeQualitySlice.actions;

export default codeQualitySlice.reducer;