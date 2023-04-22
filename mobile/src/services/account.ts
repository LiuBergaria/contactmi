import api from './api';

export const login = async (email: string, password: string) => {
  const response = await api.post('/account/login', {
    email,
    password,
  });

  return response;
};

export const createAccount = async (
  name: string,
  surname: string,
  email: string,
  password: string,
) => {
  const response = await api.post('/account', {
    name,
    surname,
    email,
    password,
  });

  return response;
};
