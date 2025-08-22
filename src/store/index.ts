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
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore action types and paths that contain non-serializable values
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredStatePaths: ['socket.connection']
      },
      immutableCheck: {
        // Ignore state paths that might contain non-serializable values
        ignoredPaths: ['socket.connection']
      }
    }),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;