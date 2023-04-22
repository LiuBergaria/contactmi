import styled from 'styled-components';
import { Form } from '@unform/web';

export const Container = styled.div`
  display: flex;

  width: 100%;
  height: 100vh;
  box-sizing: border-box;
`;

export const ImageContainer = styled.div`
  order: 2;
  flex: 1;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  display: none;

  @media (min-width: 960px) {
    display: block;
  }
`;

export const LoginForm = styled(Form)`
  order: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.foreground};

  width: 100%;

  @media (min-width: 960px) {
    width: 500px;
  }

  padding: 32px 64px;

  > img {
    margin-bottom: 32px;
  }

  > span {
    margin-top: 24px;
  }
`;
