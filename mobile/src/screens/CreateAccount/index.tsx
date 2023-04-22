import React, { useCallback, useRef } from 'react';

import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';

import LightLogo from '../../assets/ContactMi.png';
import DarkLogo from '../../assets/ContactMiDark.png';

import {
  Container,
  Logo,
  LoginContainer,
  HasAccountText,
  Input,
} from './styles';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import { createAccount } from '../../services/account';

function CreateAccount() {
  const nameValue = useRef<string>();
  const surnameValue = useRef<string>();
  const emailValue = useRef<string>();
  const passwordValue = useRef<string>();

  const { theme } = useTheme();
  const { goBack } = useNavigation();
  const { registerUser } = useUser();

  /**
   * Try to create account
   * If the API returns successful (201), the system auto-login and redirect
   * to Home
   */
  const handleCreateAccount = useCallback(async () => {
    const response = await createAccount(
      nameValue.current,
      surnameValue.current,
      emailValue.current,
      passwordValue.current,
    );

    if (response.status === 201) {
      const { token, user } = response.data;

      await registerUser({ token, user });
    }
  }, [registerUser]);

  return (
    <Container>
      <Logo source={theme === 'light' ? LightLogo : DarkLogo} />
      <Input
        onChangeText={text => {
          nameValue.current = text;
        }}
        icon="emoji-emotions"
        title="Nome"
      />
      <Input
        onChangeText={text => {
          surnameValue.current = text;
        }}
        icon="people-alt"
        title="Sobrenome"
      />
      <Input
        type="email"
        onChangeText={text => {
          emailValue.current = text;
        }}
        icon="email"
        title="E-mail"
      />
      <Input
        type="password"
        onChangeText={text => {
          passwordValue.current = text;
        }}
        icon="lock"
        title="Senha"
      />
      <Button onPress={handleCreateAccount}>Criar conta</Button>
      <LoginContainer>
        <HasAccountText>Já possui conta?</HasAccountText>
        <Button preset="inverted" onPress={() => goBack()}>
          Entrar
        </Button>
      </LoginContainer>
    </Container>
  );
}

export default CreateAccount;
