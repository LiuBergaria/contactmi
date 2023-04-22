import React, { useState } from 'react';
import { TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '../../contexts/ThemeContext';
import { Container, Input, IconContainer } from './styles';

interface TextInputProps extends TouchableOpacityProps {
  title: string;
  icon: 'lock' | 'email' | 'emoji-emotions' | 'people-alt';
  onChangeText?: (text: string) => void;
  type?: 'email' | 'password';
}

function TextInput({
  title,
  icon,
  onChangeText,
  type,
  ...rest
}: TextInputProps) {
  const { colors } = useTheme();

  const [isFocused, setIsFocused] = useState(false);

  return (
    <Container {...rest}>
      <Input
        placeholder={title}
        onChangeText={onChangeText}
        secureTextEntry={type === 'password'}
        autoCompleteType={type}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        keyboardType={type === 'email' ? 'email-address' : null}
      />
      {icon && (
        <IconContainer>
          <MaterialIcons
            name={icon}
            size={24}
            color={isFocused ? colors.primary : colors.foreground2}
          />
        </IconContainer>
      )}
    </Container>
  );
}

export default TextInput;
