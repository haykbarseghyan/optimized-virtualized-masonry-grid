import { Grid, Photo } from './lazies.ts';
import RouteWrapper from './RouteWrapper.tsx';

const routes = [
  {
    path: '/',
    element: (
      <RouteWrapper>
        <Grid />
      </RouteWrapper>
    ),
  },
  {
    path: '/photo/:id',
    element: (
      <RouteWrapper>
        <Photo />
      </RouteWrapper>
    ),
  },
];

export default routes;
