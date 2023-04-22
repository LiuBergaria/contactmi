import React, { Suspense } from 'react';
import { Switch } from 'react-router-dom';

// components
import Route from './Route';
import CustomLoader from '../components/CustomLoader';

import useWindowSize from '../hooks/useWindowSize';

// pages
import Login from '../pages/Login';
import CreateAccount from '../pages/CreateAccount';
import RecoverAccount from '../pages/RecoverAccount';
import ChangePassword from '../pages/ChangePassword';
import Main from '../pages/Main';

const Routes: React.FC = () => {
  const { width } = useWindowSize();

  return (
    <Suspense fallback={<CustomLoader />}>
      <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/criar-conta" exact component={CreateAccount} />
        <Route path="/recuperar-conta" exact component={RecoverAccount} />
        <Route path="/mudar-senha" exact component={ChangePassword} />
        <Route path="/" component={Main} isPrivate />
      </Switch>
    </Suspense>
  );
};

export default Routes;
