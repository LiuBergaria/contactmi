import { format } from 'date-fns';
import React, { useRef, useState, useCallback, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdAssignmentReturned } from 'react-icons/md';

import { useInformations } from '../../hooks/informations';
import ContactSearch from './ContactSearch';

import { Wrapper, Container, ResultsContainer } from './styles';

const SearchBox: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleChange = useCallback(() => {
    setValue(inputRef.current?.value?.trim() || '');
  }, []);

  const { contacts } = useInformations();

  const results = useMemo(() => {
    if (value === '') return [];

    return contacts
      .filter(contact =>
        `${contact.name.toUpperCase()} ${contact.surname?.toUpperCase()}`.includes(
          value.toUpperCase(),
        ),
      )
      .slice(0, 8);
  }, [contacts, value]);

  return (
    <Wrapper>
      <Container isFocused={isFocused} isFilled={!!value}>
        <input
          ref={inputRef}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleChange}
          value={value}
          placeholder="Pesquisar"
          type="text"
        />
        <FiSearch size={20} />
      </Container>
      {results.length > 0 && (
        <ResultsContainer>
          {results.map(contact => (
            <ContactSearch
              key={contact.id}
              id={contact.id}
              photo={contact.photoName}
              name={`${contact.name} ${contact.surname}`}
              onSelect={() => {
                setValue('');
              }}
            />
          ))}
        </ResultsContainer>
      )}
    </Wrapper>
  );
};

export default SearchBox;
