import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { Container } from './styles';

import PhotoPlaceholder from '../../../assets/PhotoPlaceholder.png';

interface ContactBirthdayProps {
  id: string;
  photo: string | null;
  name: string;
  birthday: string;
}

const ContactBirthday: React.FC<ContactBirthdayProps> = ({
  id,
  photo,
  name,
  birthday,
}) => {
  const history = useHistory();

  const handleSelect = useCallback(() => {
    history.push(`/contato/${id}`);
  }, [id, history]);

  return (
    <Container onClick={handleSelect}>
      <img
        src={photo ? `http://localhost:3333/files/${photo}` : PhotoPlaceholder}
        alt={name}
      />
      <div>
        <span>{name}</span>
        <span>{birthday}</span>
      </div>
    </Container>
  );
};

export default ContactBirthday;
