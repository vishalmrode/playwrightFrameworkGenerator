import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { store } from './store';
import ThemeProvider from './ThemeProvider';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';  // Add this line
import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import routes from './routes/routes';

function Spinner() {
  return (
    <Card className="mx-auto mt-24 w-fit p-8">
      <Loader2 className="mx-auto h-8 w-8 animate-spin" />
    </Card>
  )
}

function AppRoutes() {
  const routing = useRoutes(routes);

  return <Suspense fallback={<Spinner />}>{routing}</Suspense>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ReduxProvider store={store}>
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <BrowserRouter basename="/playwrightFrameworkGenerator">
              <Header />
              <div className="min-h-screen bg-background">
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </div>
            </BrowserRouter>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </ReduxProvider>
    </ErrorBoundary>
  );
}