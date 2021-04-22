import React from 'react';

import { Button, Text } from 'react-native';

import { useUser } from '../../contexts/UserContext';

import { Container } from './styles';

function Home() {
  const { unregisterUser } = useUser();

  return (
    <Container>
      <Text>Home</Text>
      <Button title="Logout" onPress={() => unregisterUser()} />
    </Container>
  );
}

export default Home;
