import React, { useCallback, useRef, useState } from 'react';
import { FiMail } from 'react-icons/fi';
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
  email: string;
}

const RecoverAccount: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async ({ email }: FormData) => {
      formRef?.current?.setErrors({});

      try {
        const schema = Yup.object().shape({
          email: Yup.string()
            .email('E-mail inválido')
            .required('Campo obrigatório'),
        });

        await schema.validate({ email }, { abortEarly: false });

        setIsLoading(true);

        const response = await api.post('/account/forgot', {
          email,
        });

        if (response.status === 200) {
          addToast({
            type: 'success',
            title: 'E-mail enviado com sucesso',
            description: 'Cheque sua caixa de entrada ou lixo eletrônico.',
          });

          history.push('/mudar-senha');
        } else {
          if (response.status === 400) {
            formRef?.current?.setErrors(response.data.validationErrors);
          }

          throw new Error('Erro ao enviar recuperação');
        }
      } catch (e) {
        setIsLoading(false);

        if (e instanceof Yup.ValidationError) {
          formRef?.current?.setErrors(getValidationErrors(e));
        }

        addToast({
          type: 'error',
          title: 'Erro na criação',
          description: 'Ocorreu um erro ao enviar o e-mail de recuperação.',
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
        <span>Enviaremos um código via e-mail para recuperar sua conta</span>
        <Input name="email" placeholder="E-mail" icon={FiMail} />
        <Button type="submit" isLoading={isLoading}>
          Enviar código
        </Button>
        <Button inverted onClick={() => history.push('/login')}>
          Voltar para login
        </Button>
      </LoginForm>
    </Container>
  );
};

export default RecoverAccount;
