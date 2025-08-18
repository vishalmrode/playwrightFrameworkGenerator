import { lazy, ReactElement } from 'react';

const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound404'));

interface Route {
  path: string;
  element: ReactElement;
}

const routes: Route[] = [
  { path: '/', element: <Home /> },
  // universal 404 fallback
  { path: '*', element: <NotFound /> },
];

export default routes;
