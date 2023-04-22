import React, { useCallback, useRef } from 'react';

import { useNavigation } from '@react-navigation/native';

import Button from '../../components/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { login } from '../../services/account';
import { useUser } from '../../contexts/UserContext';

import LightLogo from '../../assets/ContactMi.png';
import DarkLogo from '../../assets/ContactMiDark.png';

import {
  Container,
  Logo,
  CreateAccountContainer,
  NoAccountText,
  Input,
} from './styles';

function Login() {
  const emailValue = useRef<string>();
  const passwordValue = useRef<string>();

  const { registerUser } = useUser();
  const { theme } = useTheme();
  const { navigate } = useNavigation();

  /**
   * Try to login with the user credentials (email and password)
   * If the API returns successful (200), redirect user to Home
   */
  const handleLogin = useCallback(async () => {
    const response = await login(emailValue.current, passwordValue.current);

    if (response.status === 200) {
      const { token, user } = response.data;

      await registerUser({ token, user });
    }
  }, [registerUser]);

  return (
    <Container>
      {/* LOGO */}
      <Logo source={theme === 'light' ? LightLogo : DarkLogo} />

      {/* EMAIL INPUT */}
      <Input
        type="email"
        onChangeText={text => {
          emailValue.current = text;
        }}
        icon="email"
        title="E-mail"
      />
      {/* PASSWORD INPUT */}
      <Input
        type="password"
        onChangeText={text => {
          passwordValue.current = text;
        }}
        icon="lock"
        title="Senha"
      />

      {/* LOGIN BUTTON */}
      <Button onPress={handleLogin}>Entrar</Button>

      {/* FORGOT PASSWORD BUTTON */}
      {/* <Button preset="onlyText" onPress={() => navigate('ForgotPassword')}>
        Esqueci minha senha
      </Button> */}

      {/* NO ACCOUNT */}
      <CreateAccountContainer>
        <NoAccountText>Não possui conta?</NoAccountText>

        {/* CREATE ACCOUNT BUTTON */}
        <Button preset="inverted" onPress={() => navigate('CreateAccount')}>
          Criar conta
        </Button>
      </CreateAccountContainer>
    </Container>
  );
}

export default Login;
