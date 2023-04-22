import * as Yup from 'yup';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('E-mail inválido').required('Campo obrigatório'),
});

export default forgotPasswordSchema;
