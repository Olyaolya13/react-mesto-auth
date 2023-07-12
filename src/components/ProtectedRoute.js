import React from 'react';
import { Navigate, Route } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, ...props }) => {
  <Route>
    return props.isLoggedIn ? <Component {...props} /> : <Navigate to="/sigh-in" replace />;
  </Route>;
};

export default ProtectedRoute;
