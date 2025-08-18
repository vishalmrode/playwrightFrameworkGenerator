import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setSelectedLanguage } from "@/store/slices/languageSlice";
import { LANGUAGE_OPTIONS, ProgrammingLanguage } from "@/types/language";

/**
 * Language selector component that allows users to choose between TypeScript and JavaScript
 * for their generated Playwright framework. The selection affects all generated files,
 * configurations, and examples throughout the application.
 */
export function LanguageSelector() {
  const dispatch = useAppDispatch();
  const selectedLanguage = useAppSelector((state) => state.language.selectedLanguage);

  const handleLanguageChange = (value: string) => {
    dispatch(setSelectedLanguage(value as ProgrammingLanguage));
  };

  return (
    <Card data-testid="language-selector">
      <CardHeader>
        <CardTitle>Programming Language</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedLanguage} 
          onValueChange={handleLanguageChange}
          data-testid="language-options"
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem 
                value={option.value} 
                id={option.value} 
                data-testid={`${option.value}-option`} 
              />
              <Label htmlFor={option.value} className="flex flex-col flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{option.label}</span>
                  {option.recommended && (
                    <Badge variant="secondary" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">{option.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

export default LanguageSelector;