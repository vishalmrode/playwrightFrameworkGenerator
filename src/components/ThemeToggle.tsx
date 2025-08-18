import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';


export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = ['system', 'light', 'dark'] as const;
  const currentIndex = themes.indexOf(theme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];

  const cycleTheme = () => {
    setTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} className="text-foreground" />;
      case 'dark':
        return <Moon size={20} className="text-foreground" />;
      case 'system':
        return <Monitor size={20} className="text-foreground" />;
      default:
        return <Monitor size={20} className="text-foreground" />;
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={cycleTheme}
          className="p-2 w-10 h-10 rounded-md bg-secondary hover:bg-accent transition-colors border border-border"
          title={`Current theme: ${theme}`}
          data-testid="theme-toggle"
        >
          <span className="text-md flex items-center justify-center">{getThemeIcon()}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Toggle to {nextTheme} theme
      </TooltipContent>
    </Tooltip>
  );
}

export default ThemeToggle;