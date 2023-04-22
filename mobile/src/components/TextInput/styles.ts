import styled from 'styled-components/native';

export const Container = styled.View`
  width: 100%;
  background-color: ${({ theme }) => theme.background2};

  border-radius: 8px;
`;

export const Input = styled.TextInput`
  color: ${({ theme }) => theme.foreground2};

  font-size: 16px;
  padding: 12px 16px;
`;

export const IconContainer = styled.View`
  position: absolute;
  top: 16px;
  right: 16px;
`;
