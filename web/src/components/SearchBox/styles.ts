import { transparentize } from 'polished';
import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 90%;
  margin: 8px auto 8px 16px;

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
  border-radius: 32px;
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

export const ResultsContainer = styled.div`
  position: absolute;

  z-index: 1001;

  width: 100%;
  margin-top: 16px;

  padding: 16px;
  border-radius: 16px;

  background: ${({ theme }) => theme.background};

  border: 2px solid ${({ theme }) => transparentize(0.5, theme.primary)};

  box-shadow: 2px 3px 8px ${({ theme }) => transparentize(0.6, theme.primary)};
`;
