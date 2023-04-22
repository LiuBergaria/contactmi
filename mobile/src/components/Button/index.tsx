import React, { ReactNode } from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Container, Title } from './styles';

interface ButtonProps extends TouchableOpacityProps {
  children: ReactNode;
  preset?: 'normal' | 'inverted' | 'onlyText';
}

function Button({
  children,
  preset = 'normal',
  onPress,
  ...rest
}: ButtonProps) {
  return (
    <Container preset={preset} onPress={onPress} activeOpacity={0.8} {...rest}>
      <Title preset={preset}>{children}</Title>
    </Container>
  );
}

export default Button;
