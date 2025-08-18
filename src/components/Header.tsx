import ThemeToggle from "@/components/ThemeToggle";
import { VERSION } from "@/version";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header
      className="bg-background border-b p-6"
      data-testid="app-header"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground" data-testid="app-title">
                Playwright Framework Generator
              </h1>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="h-6 px-2">v{VERSION}</Badge>
                <a href="/USER_MANUAL.pdf" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground underline">Download Manual (PDF)</a>
              </div>
            </div>
            <p className="text-muted-foreground mt-2" data-testid="app-description">
              Configure and generate a complete Playwright test automation framework with modern testing practices
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;