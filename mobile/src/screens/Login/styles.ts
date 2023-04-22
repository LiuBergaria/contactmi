import styled from 'styled-components/native';
import TextInput from '../../components/TextInput';

export const Container = styled.View`
  flex: 1;

  padding: 48px 24px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
`;

export const Logo = styled.Image`
  width: 60px;
  aspect-ratio: 4.18;

  margin-bottom: 32px;
`;

export const CreateAccountContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;

  margin-top: 24px;
`;

export const NoAccountText = styled.Text`
  font-size: 16px;
  margin-bottom: 8px;
  font-weight: 500;

  color: ${({ theme }) => theme.foreground};
`;

export const Input = styled(TextInput)`
  margin-bottom: 8px;
`;
