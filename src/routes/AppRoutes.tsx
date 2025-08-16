import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { navigationRef } from '../utils/navigation';
import { routes, type RouteConfig } from './routeConfig';


const AppRoutes: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigationRef.current = (path: string) => navigate(path, { replace: true });
  }, [navigate]);

  const renderRoutes = (routes: RouteConfig[] = []) => (
    <Routes>
      {routes.map((route, i) => {
        const Component = route.component;
        return (
          <Route
            
            key={i}
            path={route.path}
            element={route.routes ? renderRoutes(route.routes) : <Component title={''} isActive={false} />}
          />
        );
      })}
    </Routes>
  );

  return renderRoutes(routes);
};

export default AppRoutes;