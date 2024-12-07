import { Grid } from './lazies.ts';
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
    path: '/preview/:id',
    element: (
      <RouteWrapper>
        <></>
      </RouteWrapper>
    ),
  },
];

export default routes;
