import * as Yup from 'yup';

const contactEmailSchema = Yup.object().shape({
  email: Yup.string()
    .min(1, 'Deve possuir no mínimo 1 caractere')
    .max(120, 'Deve possuir no máximo 120 caracteres')
    .required('Campo obrigatório'),
  description: Yup.string()
    .max(20, 'Deve possuir no máximo 20 caracteres')
    .nullable(),
});

const contactPhoneSchema = Yup.object().shape({
  number: Yup.string()
    .min(1, 'Deve possuir no mínimo 1 caractere')
    .max(30, 'Deve possuir no máximo 30 caracteres')
    .required('Campo obrigatório'),
  description: Yup.string()
    .max(20, 'Deve possuir no máximo 20 caracteres')
    .nullable(),
});

const contactCategorySchema = Yup.object().shape({
  name: Yup.string()
    .max(30, 'Deve possuir no máximo 30 caracteres')
    .required('Campo obrigatório'),
});

const contactAddressSchema = Yup.object().shape({
  cep: Yup.string()
    .length(8, 'Deve possuir no mínimo e no máximo 8 caracteres')
    .required('Campo obrigatório'),
  state: Yup.string()
    .min(1, 'Deve possuir no mínimo 1 caractere')
    .max(300, 'Deve possuir no máximo 300 caracteres')
    .required('Campo obrigatório'),
  city: Yup.string()
    .min(1, 'Deve possuir no mínimo 1 caractere')
    .max(300, 'Deve possuir no máximo 300 caracteres')
    .required('Campo obrigatório'),
  neighborhood: Yup.string()
    .min(1, 'Deve possuir no mínimo 1 caractere')
    .max(300, 'Deve possuir no máximo 300 caracteres')
    .required('Campo obrigatório'),
  address: Yup.string()
    .min(1, 'Deve possuir no mínimo 1 caractere')
    .max(300, 'Deve possuir no máximo 300 caracteres')
    .required('Campo obrigatório'),
  number: Yup.string()
    .min(1, 'Deve possuir no mínimo 1 caractere')
    .max(8, 'Deve possuir no máximo 8 caracteres')
    .required('Campo obrigatório'),
  complement: Yup.string()
    .max(120, 'Deve possuir no máximo 120 caracteres')
    .nullable(),
  description: Yup.string()
    .max(20, 'Deve possuir no máximo 20 caracteres')
    .nullable(),
});

const createContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(1, 'Deve possuir no mínimo 1 caractere')
    .max(80, 'Deve possuir no máximo 80 caracteres')
    .required('Campo obrigatório'),
  surname: Yup.string()
    .max(120, 'Deve possuir no máximo 120 caracteres')
    .nullable(),
  isFavorite: Yup.bool(),
  birthday: Yup.date().nullable(),
  observation: Yup.string()
    .max(300, 'Deve possuir no máximo 300 caracteres')
    .nullable(),
  emails: Yup.array(contactEmailSchema),
  categories: Yup.array(contactCategorySchema),
  phones: Yup.array(contactPhoneSchema),
  addresses: Yup.array(contactAddressSchema),
});

export default createContactSchema;
