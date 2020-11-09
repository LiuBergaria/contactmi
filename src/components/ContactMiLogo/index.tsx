import React, { useMemo } from 'react';

import { useTheme } from '../../hooks/theme';

import { LogoImg } from './styles';

import LightLogo from '../../assets/ContactMi.svg';
import DarkLogo from '../../assets/ContactMiDark.svg';

interface ContactMiLogoProps {
  size?: number;
  onClick?(): void;
}

const ContactMiLogo: React.FC<ContactMiLogoProps> = ({
  size = 150,
  onClick,
}) => {
  const { theme } = useTheme();

  const Logo = useMemo(() => (theme === 'light' ? LightLogo : DarkLogo), [
    theme,
  ]);

  return (
    <LogoImg
      size={size}
      src={Logo}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    />
  );
};

export default ContactMiLogo;
