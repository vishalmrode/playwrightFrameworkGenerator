export const VERSION = '1.1.5';
export const BUILD_DATE = '2025-08-23';

export interface VersionInfo {
  version: string;
  buildDate: string;
  environment: string;
  commitHash?: string;
}

export const getVersionInfo = (): VersionInfo => ({
  version: VERSION,
  buildDate: BUILD_DATE,
  environment: process.env.NODE_ENV || 'development',
  commitHash: process.env.VITE_GIT_HASH,
});
