import React, { useCallback, useRef, useState } from 'react';
import { FiLock, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Button';
import Input from '../../components/Input';
import ContactMiLogo from '../../components/ContactMiLogo';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import { Container, ImageContainer, LoginForm } from './styles';

import LoginAside from '../../assets/LoginAside.jpg';

interface FormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleLogin = useCallback(
    async ({ email, password }: FormData) => {
      formRef?.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('E-mail inválido')
            .required('Usuário obrigatório'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate({ email, password }, { abortEarly: false });

        setIsLoading(true);

        const response = await api.post('/account/login', {
          email,
          password,
        });

        if (response.status === 200) {
          const { token, user } = response.data;

          await signIn({ token, user });

          history.push('/');
        } else {
          if (response.status === 400) {
            formRef?.current?.setErrors(response.data.validationErrors);
          }

          throw new Error('Erro ao logar');
        }
      } catch (e) {
        setIsLoading(false);

        if (e instanceof Yup.ValidationError) {
          formRef?.current?.setErrors(getValidationErrors(e));
        }

        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    [signIn, history, addToast],
  );

  return (
    <Container>
      <ImageContainer>
        <img src={LoginAside} alt="Login Background" />
      </ImageContainer>
      <LoginForm ref={formRef} onSubmit={handleLogin}>
        <ContactMiLogo />
        <Input name="email" placeholder="E-mail" icon={FiMail} />
        <Input
          name="password"
          placeholder="Senha"
          icon={FiLock}
          type="password"
        />
        <Button type="submit" isLoading={isLoading}>
          Entrar
        </Button>
        <Button borderless onClick={() => history.push('/recuperar-conta')}>
          Esqueci minha senha
        </Button>
        <span>Não possui conta?</span>
        <Button inverted onClick={() => history.push('/criar-conta')}>
          Criar conta
        </Button>
      </LoginForm>
    </Container>
  );
};

export default Login;
