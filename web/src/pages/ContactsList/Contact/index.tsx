import React, { useCallback } from 'react';
import { MdFavorite } from 'react-icons/md';

import { useHistory } from 'react-router-dom';
import { Container } from './styles';

import PhotoPlaceholder from '../../../assets/PhotoPlaceholder.png';

export interface ContactData {
  id: string;
  name: string;
  surname: string | null;
  isFavorite: boolean;
  photoName: string | null;
  birthday: Date | null;
  observation: string | null;
  emails: {
    email: string;
    description: string | null;
  }[];
  phones: {
    number: string;
    description: string | null;
  }[];
  addresses: {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    address: string;
    number: string;
    complement: string | null;
    description: string | null;
  }[];
  categories: {
    name: string;
  }[];
}

interface ContactProps {
  contact: ContactData;
}

const Contact: React.FC<ContactProps> = ({ contact }) => {
  const history = useHistory();

  const handleSelect = useCallback(() => {
    history.push(`/contato/${contact.id}`);
  }, [contact.id, history]);

  return (
    <Container onClick={handleSelect}>
      <img
        src={
          contact.photoName
            ? `http://localhost:3333/files/${contact.photoName}`
            : PhotoPlaceholder
        }
        alt={contact.name}
      />
      <div>
        <span>
          {`${contact.name} ${contact.surname}`}
          {contact.isFavorite && <MdFavorite size={18} />}
        </span>
        {contact.phones[0] && <span>{contact.phones[0].number}</span>}
      </div>
    </Container>
  );
};

export default Contact;
