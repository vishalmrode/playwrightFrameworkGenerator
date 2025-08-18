import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import languageReducer from './slices/languageSlice';
import browserReducer from './slices/browserSlice';
import testingCapabilitiesReducer from './slices/testingCapabilitiesSlice';
import environmentReducer from './slices/environmentSlice';
import integrationsReducer from './slices/integrationsSlice';
import fixturesReducer from './slices/fixturesSlice';
import dockerReducer from './slices/dockerSlice';
import codeQualityReducer from './slices/codeQualitySlice';
import ciPipelineReducer from './slices/ciPipelineSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    language: languageReducer,
    browser: browserReducer,
    testingCapabilities: testingCapabilitiesReducer,
    environment: environmentReducer,
    integrations: integrationsReducer,
    fixtures: fixturesReducer,
    docker: dockerReducer,
    codeQuality: codeQualityReducer,
    ciPipeline: ciPipelineReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
