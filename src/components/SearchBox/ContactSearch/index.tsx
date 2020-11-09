import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Container } from './styles';

import PhotoPlaceholder from '../../../assets/PhotoPlaceholder.png';

interface ContactSearchProps {
  id: string;
  photo: string | null;
  name: string;
  onSelect(): void;
}

const ContactSearch: React.FC<ContactSearchProps> = ({
  id,
  photo,
  name,
  onSelect,
}) => {
  const history = useHistory();

  const handleSelect = useCallback(() => {
    history.push(`/contato/${id}`);
    onSelect();
  }, [id, history, onSelect]);

  return (
    <Container onClick={handleSelect}>
      <img
        src={photo ? `http://localhost:3333/files/${photo}` : PhotoPlaceholder}
        alt={name}
      />
      <div>
        <span>{name}</span>
      </div>
    </Container>
  );
};

export default ContactSearch;
