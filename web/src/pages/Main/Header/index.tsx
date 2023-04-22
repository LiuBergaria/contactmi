import React, { useMemo } from 'react';
import { FiGift, FiMoon, FiShare, FiSun } from 'react-icons/fi';
import { MdExitToApp } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import Button from '../../../components/Button';
import ContactMiLogo from '../../../components/ContactMiLogo';
import SearchBox from '../../../components/SearchBox';
import { useAuth } from '../../../hooks/auth';

import { useTheme } from '../../../hooks/theme';
import useWindowSize from '../../../hooks/useWindowSize';

import { Container, ButtonsContainer, SearchContainer } from './styles';

const Header: React.FC = () => {
  const { toggleTheme, theme } = useTheme();
  const history = useHistory();
  const { signOut } = useAuth();
  const { width } = useWindowSize();

  const isDesktop = useMemo(() => width >= 960, [width]);

  return (
    <Container>
      <ContactMiLogo
        size={isDesktop ? 150 : 120}
        onClick={() => history.push('/')}
      />
      {isDesktop && (
        <SearchContainer>
          <SearchBox />
        </SearchContainer>
      )}
      <ButtonsContainer>
        {/* <Button
          borderless
          noMargin
          onClick={() => history.push('/importar-exportar')}
        >
          <FiShare size={24} />
        </Button> */}
        <Button
          borderless
          noMargin
          onClick={() => history.push('/aniversarios')}
        >
          <FiGift size={24} />
        </Button>
        <Button borderless noMargin onClick={toggleTheme}>
          {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
        </Button>
        <Button borderless noMargin onClick={signOut}>
          <MdExitToApp size={24} />
        </Button>
      </ButtonsContainer>
    </Container>
  );
};

export default Header;
