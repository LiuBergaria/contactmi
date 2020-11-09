import * as Yup from 'yup';

const createCategorySchema = Yup.object().shape({
  name: Yup.string()
    .max(30, 'Deve possuir no máximo 30 caracteres')
    .required('Campo obrigatório'),
});

export default createCategorySchema;
