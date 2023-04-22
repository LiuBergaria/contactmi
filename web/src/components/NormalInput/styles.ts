import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;

  & + div {
    margin-top: 8px;
  }

  > span {
    display: block;
    color: #c53030;
    margin: 0 8px;
    font-size: 0.95rem;
  }
`;

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: ${({ theme }) => theme.background2};
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.background2};
  color: ${({ theme }) => theme.foreground};
  display: flex;
  align-items: center;
  font-size: 1rem;

  ${props =>
    props.isFocused &&
    css`
      color: ${({ theme }) => theme.primary};
      border-color: ${({ theme }) => theme.primary};
    `}
  ${props =>
    props.isFilled &&
    css`
      color: ${({ theme }) => theme.primary};
    `}
  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: ${({ theme }) => theme.foreground};
    &::placeholder {
      color: ${({ theme }) => theme.foreground2};
    }
  }
  svg {
    margin-left: 16px;
  }
`;
