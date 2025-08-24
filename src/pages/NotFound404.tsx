import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export function NotFound404() {
  return (
    <main className="p-8" data-testid="not-found-page">
      <Card data-testid="not-found-card">
        <CardHeader>
          <CardTitle>404</CardTitle>
          <CardDescription>Page Not Found</CardDescription>
        </CardHeader>
        <CardContent>
          <p>The page you're looking for doesn't exist.</p>
        </CardContent>
      </Card>
    </main>
  );
}

export default NotFound404;