import React, { ButtonHTMLAttributes } from 'react';
import Loader from 'react-loader-spinner';

import { useTheme } from '../../hooks/theme';

import { Container } from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  inverted?: boolean;
  borderless?: boolean;
  isLoading?: boolean;
  noMargin?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  inverted,
  borderless,
  isLoading,
  noMargin,
  ...rest
}) => {
  const { colors } = useTheme();

  return (
    <Container
      inverted={Number(inverted)}
      borderless={Number(borderless)}
      noMargin={Number(noMargin)}
      type="button"
      disabled={isLoading}
      {...rest}
    >
      {isLoading ? (
        <Loader
          color={!inverted && !borderless ? '#fff' : colors.primary}
          width={20}
          height={20}
          type="Bars"
        />
      ) : (
        children
      )}
    </Container>
  );
};

export default Button;
