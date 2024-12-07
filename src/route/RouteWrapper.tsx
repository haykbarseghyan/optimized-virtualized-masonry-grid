import { ReactElement } from 'react';

interface IRouteWrapperProps {
  children: ReactElement;
}
const RouteWrapper = ({ children }: IRouteWrapperProps) => {
  //TO DO add Layout insted fragment
  return <>{children}</>;
};
export default RouteWrapper;
