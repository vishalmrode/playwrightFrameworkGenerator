import { describe, it, expect } from 'vitest';
import { generateEnvExampleForName, GenerateState } from '@/lib/generateFramework';

describe('generateEnvExampleForName', () => {
  it('uses project baseUrl and apiUrl when provided', () => {
    const state = {
      environment: {
        baseUrl: 'http://primary.local',
        apiUrl: 'http://primary.local/api',
        projects: [
          { name: 'staging', baseUrl: 'https://staging.example.com', apiUrl: 'https://staging.example.com/api' },
          { name: 'production', baseUrl: 'https://example.com', apiUrl: 'https://example.com/api' }
        ]
      }
    } as Partial<GenerateState>;

    const output = generateEnvExampleForName(state as any, 'production');
    expect(output).toContain('BASE_URL=https://example.com');
    expect(output).toContain('API_BASE_URL=https://example.com/api');
  });

  it('falls back to primary env values when project not found', () => {
    const state = {
      environment: {
        baseUrl: 'http://primary.local',
        apiUrl: 'http://primary.local/api',
        projects: []
      }
    } as Partial<GenerateState>;

    const output = generateEnvExampleForName(state as any, 'unknown');
    expect(output).toContain('BASE_URL=http://primary.local');
    expect(output).toContain('API_BASE_URL=http://primary.local/api');
  });
});
