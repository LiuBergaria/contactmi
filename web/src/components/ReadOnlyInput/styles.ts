import styled, { css } from 'styled-components';

interface ContainerProps {
  hidden?: boolean;
}

export const Container = styled.div<ContainerProps>`
  color: ${({ theme }) => theme.foreground};
  width: 100%;
  font-size: 1rem;

  ${({ hidden }) =>
    hidden &&
    css`
      visibility: hidden;
    `}

  input {
    flex: 1;
    background: transparent;
    border: 0;

    color: ${({ theme }) => theme.foreground};
  }
`;
