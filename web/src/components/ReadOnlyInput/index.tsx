import React, { InputHTMLAttributes, useEffect, useRef } from 'react';
import { useField } from '@unform/core';

import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  hidden?: boolean;
}

const ReadOnlyInput: React.FC<InputProps> = ({ name, hidden, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, error, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container hidden={hidden}>
      <input
        ref={inputRef}
        readOnly
        defaultValue={defaultValue}
        type="text"
        {...rest}
      />
    </Container>
  );
};

export default ReadOnlyInput;
