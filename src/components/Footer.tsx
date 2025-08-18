import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, BookOpen, Github, Heart } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import { getLanguageLabel } from "@/lib/SelectProgrammingLanguage";

export function Footer() {
  const selectedLanguage = useAppSelector((state) => state.language.selectedLanguage);
  return (
    <Card data-testid="footer">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Documentation
            </h4>
            <div className="space-y-2">
              <a href="https://playwright.dev/docs/intro" target="_blank" rel="noopener noreferrer" data-testid="playwright-docs-link" className="flex items-center gap-2 p-0 h-auto text-sm">
                <ExternalLink className="w-3 h-3" />
                Playwright Documentation
              </a>
              <a href="https://playwright.dev/docs/best-practices" target="_blank" rel="noopener noreferrer" data-testid="best-practices-link" className="flex items-center gap-2 p-0 h-auto text-sm">
                <ExternalLink className="w-3 h-3" />
                Testing Best Practices
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Framework Features</h4>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>✅ Cross-browser testing</div>
              <div>✅ Page Object Model</div>
              <div>✅ Custom fixtures & utilities</div>
              <div>✅ CI/CD integration</div>
              <div>✅ Comprehensive reporting</div>
              <div>✅ {getLanguageLabel(selectedLanguage)} support</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Github className="w-4 h-4" />
              Resources
            </h4>
            <div className="space-y-2">
              <a href="https://github.com/microsoft/playwright" target="_blank" rel="noopener noreferrer" data-testid="source-code-link" className="flex items-center gap-2 p-0 h-auto text-sm">
                <ExternalLink className="w-3 h-3" />
                Playwright GitHub
              </a>
              <a href="https://github.com/microsoft/playwright-mcp" target="_blank" rel="noopener noreferrer" data-testid="playwright-mcp-link" className="flex items-center gap-2 p-0 h-auto text-sm">
                <ExternalLink className="w-3 h-3" />
                Playwright MCP
              </a>
              <a href="https://playwright.dev/community/welcome" target="_blank" rel="noopener noreferrer" data-testid="community-link" className="flex items-center gap-2 p-0 h-auto text-sm">
                <ExternalLink className="w-3 h-3" />
                Community Forum
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1" data-testid="footer-credits">
            Built with <Heart className="w-3 h-3 text-red-500 fill-current" /> for the testing community
          </p>
          <p className="mt-1">
            Generate your perfect Playwright framework in seconds • Free & Open Source
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default Footer;