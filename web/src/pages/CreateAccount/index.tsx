import React, { useCallback, useRef, useState } from 'react';
import { FiLock, FiMail, FiSmile, FiUsers } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Button';
import Input from '../../components/Input';
import ContactMiLogo from '../../components/ContactMiLogo';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import { Container, ImageContainer, LoginForm } from './styles';

import LoginAside from '../../assets/LoginAside.jpg';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
}

const CreateAccount: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async ({ name, surname, email, password }: FormData) => {
      formRef?.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          name: Yup.string()
            .min(3, 'Deve possuir no mínimo 3 caracteres')
            .max(30, 'Deve possuir no máximo 30 caracteres')
            .required('Campo obrigatório'),
          surname: Yup.string()
            .min(3, 'Deve possuir no mínimo 3 caracteres')
            .max(120, 'Deve possuir no máximo 120 caracteres')
            .required('Campo obrigatório'),
          email: Yup.string()
            .email('E-mail inválido')
            .required('Campo obrigatório'),
          password: Yup.string()
            .min(8, 'Deve possuir no mínimo 8 caracteres')
            .required('Campo obrigatório'),
        });

        await schema.validate(
          { name, surname, email, password },
          { abortEarly: false },
        );

        setIsLoading(true);

        const response = await api.post('/account', {
          name,
          surname,
          email,
          password,
        });

        if (response.status === 201) {
          const { token, user } = response.data;

          await signIn({ token, user });

          history.push('/');
        } else {
          if (response.status === 400) {
            formRef?.current?.setErrors(response.data.validationErrors);
          }

          throw new Error('Erro ao criar conta');
        }
      } catch (e) {
        setIsLoading(false);

        if (e instanceof Yup.ValidationError) {
          formRef?.current?.setErrors(getValidationErrors(e));
        }

        addToast({
          type: 'error',
          title: 'Erro na criação',
          description: 'Ocorreu um erro ao criar conta, cheque as informações.',
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
      <LoginForm ref={formRef} onSubmit={handleSubmit}>
        <ContactMiLogo />
        <Input name="name" placeholder="Nome" icon={FiSmile} />
        <Input name="surname" placeholder="Sobrenome" icon={FiUsers} />
        <Input name="email" placeholder="E-mail" icon={FiMail} />
        <Input
          name="password"
          placeholder="Senha"
          icon={FiLock}
          type="password"
        />
        <Button type="submit" isLoading={isLoading}>
          Criar Conta
        </Button>
        <span>Já possui conta?</span>
        <Button inverted onClick={() => history.push('/login')}>
          Entrar
        </Button>
      </LoginForm>
    </Container>
  );
};

export default CreateAccount;
