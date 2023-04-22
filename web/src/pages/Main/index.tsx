import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';

import ContactsList from '../ContactsList';
import Header from './Header';

import ViewContact from '../ViewContact';

import useWindowSize from '../../hooks/useWindowSize';

import { Container } from './styles';
import ImportExport from '../ImportExport';
import EditContact from '../EditContact';
import Birthdays from '../Birthdays';

const Main: React.FC = () => {
  const { width } = useWindowSize();

  const isDesktop = useMemo(() => width >= 960, [width]);

  return (
    <Container>
      <Header />
      <div>
        {isDesktop && <ContactsList />}
        <div>
          <Switch>
            {isDesktop ? (
              <Route path="/" exact component={Birthdays} />
            ) : (
              <Route path="/" exact component={ContactsList} />
            )}
            <Route path="/contato/:id" exact component={ViewContact} />
            <Route path="/importar-exportar" exact component={ImportExport} />
            <Route path="/contato/:id/editar" exact component={EditContact} />
            <Route path="/novo-contato" exact component={EditContact} />
            <Route path="/aniversarios" exact component={Birthdays} />
          </Switch>
        </div>
      </div>
    </Container>
  );
};

export default Main;
