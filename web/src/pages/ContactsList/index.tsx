import React, { useCallback, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import { MdFavorite } from 'react-icons/md';
import { useHistory } from 'react-router-dom';

import SearchBox from '../../components/SearchBox';
import Contact from './Contact';

import useWindowSize from '../../hooks/useWindowSize';

import {
  Container,
  LetterSelection,
  ContactsContainer,
  AddButton,
} from './styles';
import { useInformations } from '../../hooks/informations';

const letters = [
  { icon: <MdFavorite />, path: 'FV' },
  { icon: '#', path: 'CS' },
  { icon: 'A', path: 'A' },
  { icon: 'B', path: 'B' },
  { icon: 'C', path: 'C' },
  { icon: 'D', path: 'D' },
  { icon: 'E', path: 'E' },
  { icon: 'F', path: 'F' },
  { icon: 'G', path: 'G' },
  { icon: 'H', path: 'H' },
  { icon: 'I', path: 'I' },
  { icon: 'J', path: 'J' },
  { icon: 'K', path: 'K' },
  { icon: 'L', path: 'L' },
  { icon: 'M', path: 'M' },
  { icon: 'N', path: 'N' },
  { icon: 'O', path: 'O' },
  { icon: 'P', path: 'P' },
  { icon: 'Q', path: 'Q' },
  { icon: 'R', path: 'R' },
  { icon: 'S', path: 'S' },
  { icon: 'T', path: 'T' },
  { icon: 'U', path: 'U' },
  { icon: 'V', path: 'V' },
  { icon: 'W', path: 'W' },
  { icon: 'X', path: 'X' },
  { icon: 'Y', path: 'Y' },
  { icon: 'Z', path: 'Z' },
];

const ContactsList: React.FC = () => {
  const history = useHistory();
  const { width } = useWindowSize();

  const { organizedContacts } = useInformations();

  const isDesktop = useMemo(() => width >= 960, [width]);

  const handleLetterSelect = useCallback((path: string) => {
    const el = document.getElementById(`ContactsWith${path}`);

    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <Container>
      {!isDesktop && <SearchBox />}
      <ContactsContainer>
        {letters.map(letter => (
          <div key={letter.path} id={`ContactsWith${letter.path}`}>
            {(organizedContacts[letter.path] || []).map(contact => (
              <Contact key={contact.id} contact={contact} />
            ))}
          </div>
        ))}
        <LetterSelection>
          {letters.map(letter => (
            <button
              key={letter.path}
              type="button"
              onClick={() => {
                handleLetterSelect(letter.path);
              }}
            >
              {letter.icon}
            </button>
          ))}
        </LetterSelection>
      </ContactsContainer>
      <AddButton type="button" onClick={() => history.push('/novo-contato')}>
        <FiPlus size={32} />
      </AddButton>
    </Container>
  );
};

export default ContactsList;
