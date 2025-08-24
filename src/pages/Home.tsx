import React from 'react';
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
                className="w-full border rounded px-3 py-2 text-base"
                data-testid="project-name-input"
              />
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