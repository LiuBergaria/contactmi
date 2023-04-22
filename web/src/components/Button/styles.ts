import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ContainerProps {
  inverted?: number;
  borderless?: number;
  noMargin?: number;
}

export const Container = styled.button<ContainerProps>`
  ${({ theme, inverted, borderless }) => {
    if (inverted)
      return css`
        height: 48px;
        background: ${theme.background2};
        color: ${theme.primary};

        &:hover {
          background: ${shade(0.15, theme.background2)};
        }
      `;

    if (borderless)
      return css`
        background: transparent;
        color: ${theme.primary};

        &:hover {
          text-decoration: underline;
        }
      `;

    return css`
      height: 48px;
      background: ${theme.primary};
      color: #fff;

      &:hover {
        background: ${shade(0.15, theme.primary)};
      }
    `;
  }}

  border-radius: 8px;
  border: 0;
  padding: 0 16px;
  width: 100%;
  font-weight: 500;
  font-size: 1rem;

  ${({ noMargin }) =>
    !noMargin &&
    css`
      margin-top: 16px;
    `}

  cursor: pointer;
  transition: background-color 0.2s;
`;
