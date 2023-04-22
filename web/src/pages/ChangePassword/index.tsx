import React, { useCallback, useRef, useState } from 'react';
import { FiAlertOctagon, FiMail } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Button';
import Input from '../../components/Input';
import ContactMiLogo from '../../components/ContactMiLogo';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import { Container, ImageContainer, LoginForm } from './styles';

import LoginAside from '../../assets/LoginAside.jpg';

interface FormData {
  token: string;
  password: string;
}

const ChangePassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async ({ token, password }: FormData) => {
      formRef?.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          token: Yup.string().required('Campo obrigatório'),
          password: Yup.string()
            .min(8, 'Deve possuir no mínimo 8 caracteres')
            .required('Campo obrigatório'),
        });

        await schema.validate({ token, password }, { abortEarly: false });

        setIsLoading(true);

        const response = await api.post('/account/change-password', {
          token,
          password,
        });

        if (response.status === 200) {
          addToast({
            type: 'success',
            title: 'Senha alterada com sucesso',
            description: 'Você já pode entrar.',
          });

          history.push('/login');
        } else {
          if (response.status === 400) {
            formRef?.current?.setErrors(response.data.validationErrors);
          }

          throw new Error('Erro ao mudar senha');
        }
      } catch (e) {
        setIsLoading(false);

        if (e instanceof Yup.ValidationError) {
          formRef?.current?.setErrors(getValidationErrors(e));
        }

        addToast({
          type: 'error',
          title: 'Erro na criação',
          description: 'Ocorreu um erro ao mudar a senha.',
        });
      }
    },
    [history, addToast],
  );

  return (
    <Container>
      <ImageContainer>
        <img src={LoginAside} alt="Login Background" />
      </ImageContainer>
      <LoginForm ref={formRef} onSubmit={handleSubmit}>
        <ContactMiLogo />
        <span>Insira o código recebido</span>
        <Input
          name="token"
          placeholder="Token de recuperação"
          icon={FiAlertOctagon}
        />
        <Input
          name="password"
          placeholder="Senha"
          icon={FiMail}
          type="password"
        />
        <Button type="submit" isLoading={isLoading}>
          Enviar código
        </Button>
        <span>Caso não tenha recebimento o código, tente novamente</span>
        <Button inverted onClick={() => history.push('/recuperar-conta')}>
          Voltar para recuperação
        </Button>
        <Button inverted onClick={() => history.push('/login')}>
          Voltar para login
        </Button>
      </LoginForm>
    </Container>
  );
};

export default ChangePassword;
