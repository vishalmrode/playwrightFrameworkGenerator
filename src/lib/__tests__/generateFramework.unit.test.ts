import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { generateFramework, type GenerateState } from '../generateFramework';

describe('generateFramework', () => {
    const createBasicState = (): GenerateState => ({
        language: { selectedLanguage: 'typescript' },
        browser: { selectedBrowsers: { chromium: true } },
        testingCapabilities: { uiTesting: true },
        environment: { baseUrl: 'http://localhost:3000' },
        ciPipeline: { 
            enabled: false, 
            workflows: [], 
            selectedWorkflowIndex: 0,
            globalSettings: {}
        } as any,
        docker: { enabled: false },
        integrations: {},
        fixtures: {},
        ui: { theme: 'light' }
    });

    it('should generate a framework with basic configuration', async () => {
        const state = createBasicState();
        const progress: any[] = [];
        
        const result = await generateFramework(state, (p) => progress.push(p));
        expect(result).toBeDefined();
        expect(result instanceof Blob || Buffer.isBuffer(result)).toBe(true);
        expect(progress.length).toBeGreaterThan(0);
    });

    it('should include package.json and playwright config in generated ZIP', async () => {
        const state = createBasicState();
        const result = await generateFramework(state, () => {});
        
        const zip = await JSZip.loadAsync(result as any);
        const files = Object.keys(zip.files);
        
        expect(files).toContain('package.json');
        expect(files.some(f => f.includes('playwright.config'))).toBe(true);
        expect(files.some(f => f.startsWith('tests/'))).toBe(true);
    });

    it('should include CI workflows when CI is enabled', async () => {
        const state = createBasicState();
        state.ciPipeline.enabled = true;
        state.ciPipeline.workflows = [{ name: 'test-workflow' } as any];
        
        const result = await generateFramework(state, () => {});
        const zip = await JSZip.loadAsync(result as any);
        const files = Object.keys(zip.files);
        
        expect(files.some(f => f.startsWith('.github/workflows/'))).toBe(true);
    });

    it('should throw error when no language is selected', async () => {
        const state = createBasicState();
        state.language.selectedLanguage = null;
        
        await expect(generateFramework(state, () => {})).rejects.toThrow('No programming language selected');
    });

    it('should throw error when no browsers are selected', async () => {
        const state = createBasicState();
        state.browser.selectedBrowsers = {};
        
        await expect(generateFramework(state, () => {})).rejects.toThrow('No browsers selected for testing');
    });

    it('should generate JavaScript project when JS is selected', async () => {
        const state = createBasicState();
        state.language.selectedLanguage = 'javascript';
        
        const result = await generateFramework(state, () => {});
        const zip = await JSZip.loadAsync(result as any);
        const packageJson = await zip.file('package.json')?.async('string');
        
        expect(packageJson).toBeDefined();
        // Should not include TypeScript dependencies for JS projects
        const pkg = JSON.parse(packageJson!);
        expect(pkg.devDependencies?.typescript).toBeUndefined();
    });

    it('should handle progress callbacks', async () => {
        const state = createBasicState();
        const progressSteps: any[] = [];
        
        await generateFramework(state, (step) => {
            progressSteps.push(step);
        });
        
        expect(progressSteps.length).toBeGreaterThan(0);
        expect(progressSteps.every(step => typeof step.progress === 'number')).toBe(true);
        expect(progressSteps.every(step => typeof step.message === 'string')).toBe(true);
    });
});