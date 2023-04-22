import React, {
  InputHTMLAttributes,
  useRef,
  useState,
  useCallback,
} from 'react';
import { IconBaseProps } from 'react-icons';

import { Wrapper, Container } from './styles';

interface NormalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<IconBaseProps>;
}

const NormalInput: React.FC<NormalInputProps> = ({ icon: Icon, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  return (
    <Wrapper>
      <Container isFocused={isFocused} isFilled={isFilled}>
        <input
          ref={inputRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          type="text"
          {...rest}
        />
        {Icon && <Icon size={24} />}
      </Container>
    </Wrapper>
  );
};

export default NormalInput;
