import * as Yup from 'yup';

const createAccountSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Deve possuir no mínimo 3 caracteres')
    .max(30, 'Deve possuir no máximo 30 caracteres')
    .required('Campo obrigatório'),
  surname: Yup.string()
    .min(3, 'Deve possuir no mínimo 3 caracteres')
    .max(120, 'Deve possuir no máximo 120 caracteres')
    .required('Campo obrigatório'),
  email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
  password: Yup.string()
    .min(8, 'Deve possuir no mínimo 8 caracteres')
    .required('Campo obrigatório'),
});

export default createAccountSchema;
