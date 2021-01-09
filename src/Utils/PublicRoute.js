import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';

// handle the public routes
function PublicRoute({ component: Component, ...rest }) {

  var path = getToken() == 1 ? '/admin' : '/dashboard'


  return (
    <Route
      {...rest}
      render={(props) => !getToken() ? <Component {...props} /> : <Redirect to={{ pathname: path }} />}
    />
  )
}

export default PublicRoute;