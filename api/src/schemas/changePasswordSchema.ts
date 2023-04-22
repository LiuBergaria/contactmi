import * as Yup from 'yup';

const changePasswordSchema = Yup.object().shape({
  token: Yup.string().uuid('Token inválido').required('Campo obrigatório'),
  password: Yup.string()
    .min(8, 'Deve possuir no mínimo 8 caracteres')
    .required('Campo obrigatório'),
});

export default changePasswordSchema;
