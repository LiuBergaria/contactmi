import React from 'react';
import Loader from 'react-loader-spinner';

import { useTheme } from '../../hooks/theme';

import { Container } from './styles';

const CustomLoader: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Container>
      <Loader width={48} color={colors.primary} type="ThreeDots" />
    </Container>
  );
};

export default CustomLoader;
