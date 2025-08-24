import React, { useState } from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import BrowserConfiguration from '@/components/BrowserConfiguration';
import TestingCapabilities from '@/components/TestingCapabilities';
import IntegrationsPanel from '@/components/IntegrationsPanel';
import FixturesConfiguration from '@/components/FixturesConfiguration';
import EnvironmentSettings from '@/components/EnvironmentSettings';
import CodeQualityOptions from '@/components/CodeQualityOptions';
import CIConfiguration from '@/components/CIConfiguration';
import DockerOptions from '@/components/DockerOptions';
import PreviewPanel from '@/components/PreviewPanel';
import GenerateButton from '@/components/GenerateButton';
import ExampleShowcase from '@/components/ExampleShowcase';
import Footer from '@/components/Footer';

export function Home() {
  const [projectName, setProjectName] = useState('');
  const [projectNameError, setProjectNameError] = useState<string | null>(null);

  // Project name validation: 3-50 chars, alphanumeric, dashes, underscores, no spaces, must start with a letter
  function validateProjectName(name: string): string | null {
    if (!name) return 'Project name is required.';
    if (name.length < 3) return 'Project name must be at least 3 characters.';
    if (name.length > 50) return 'Project name must be at most 50 characters.';
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)) {
      return 'Project name must start with a letter and only contain letters, numbers, dashes, or underscores.';
    }
    return null;
  }

  function handleProjectNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setProjectName(value);
    setProjectNameError(validateProjectName(value));
  }

  return (
    <div className="min-h-screen bg-background" data-testid="home-page">
      <main className="max-w-7xl mx-auto p-6" data-testid="main-content">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Name Input */}
            <div className="mb-4">
              <label htmlFor="project-name" className="block text-sm font-medium text-foreground mb-1">Project Name *</label>
              <input
                id="project-name"
                name="project-name"
                type="text"
                placeholder="Enter your project name"
                className={`w-full border rounded px-3 py-2 text-base ${projectNameError ? 'border-destructive' : ''}`}
                data-testid="project-name-input"
                value={projectName}
                onChange={handleProjectNameChange}
                aria-invalid={!!projectNameError}
                aria-describedby="project-name-error"
                maxLength={50}
                minLength={3}
                pattern="^[a-zA-Z][a-zA-Z0-9_-]*$"
                required
              />
              {projectNameError && (
                <div id="project-name-error" className="text-destructive text-xs mt-1">
                  {projectNameError}
                </div>
              )}
            </div>
            <LanguageSelector />
            <BrowserConfiguration />
            <TestingCapabilities />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IntegrationsPanel />
              <FixturesConfiguration />
            </div>
            <EnvironmentSettings />
            <CodeQualityOptions />
            <div className="grid grid-cols-1 gap-6">
              <CIConfiguration />
              <DockerOptions />
            </div>
            <ExampleShowcase />
          </div>
          {/* Right column - Preview and Generate */}
          <div className="space-y-6">
            <PreviewPanel />
            <GenerateButton />
          </div>
        </div>
        <div className="mt-12">
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default Home;