import React, { useCallback, useMemo, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import {
  FiDelete,
  FiEdit2,
  FiGift,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiTag,
} from 'react-icons/fi';

import { format } from 'date-fns';
import Loader from 'react-loader-spinner';

import { useInformations } from '../../hooks/informations';
import { useTheme } from '../../hooks/theme';
import { useToast } from '../../hooks/toast';

import {
  Container,
  ContactHeader,
  ContactBody,
  ButtonsContainer,
  Section,
} from './styles';

import PhotoPlaceholder from '../../assets/PhotoPlaceholder.png';
import Button from '../../components/Button';
import api from '../../services/api';

interface ViewContactParams {
  id: string;
}

const ViewContact: React.FC = () => {
  const { id } = useParams<ViewContactParams>();
  const { getContactById, updateContact, removeContact } = useInformations();
  const { colors } = useTheme();
  const history = useHistory();
  const { addToast } = useToast();

  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);

  const contact = useMemo(() => getContactById(id), [getContactById, id]);

  const handleToggleFavorite = useCallback(async () => {
    if (!contact) return;

    try {
      setIsLoadingFavorite(true);

      const response = await api.patch(`/contacts/${contact.id}/fav`);

      if (response.status === 200) {
        const {
          contact: { isFavorite },
        } = response.data;
        updateContact({ ...contact, isFavorite });
      } else throw new Error('Erro ao favoritar contato');
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Erro ao favoritar contato',
      });
    } finally {
      setIsLoadingFavorite(false);
    }
  }, [addToast, contact, updateContact]);

  const handleDelete = useCallback(async () => {
    if (!contact) return;

    // eslint-disable-next-line no-alert
    if (window.confirm('Deseja realmente deletar o contato?')) {
      try {
        setIsLoadingFavorite(true);

        const response = await api.delete(`/contacts/${contact.id}`);

        if (response.status === 200) {
          removeContact(contact);

          addToast({
            type: 'success',
            title: 'Contato removido com sucesso',
          });
        } else throw new Error('Erro ao remover contato');
      } catch (e) {
        addToast({
          type: 'error',
          title: 'Erro ao remover contato',
        });
      } finally {
        setIsLoadingFavorite(false);
      }
    }
  }, [addToast, contact, removeContact]);

  if (!contact) return <Redirect to="/" />;

  return (
    <Container>
      <ContactHeader>
        <img
          src={
            contact.photoName
              ? `http://localhost:3333/files/${contact.photoName}`
              : PhotoPlaceholder
          }
          alt={contact.name}
        />
        <h2>
          {`${contact.name} ${contact.surname}`}
          {isLoadingFavorite ? (
            <Loader color={colors.primary} width={24} height={24} type="Bars" />
          ) : (
            <button type="button" onClick={handleToggleFavorite}>
              {contact.isFavorite ? (
                <MdFavorite size={24} color={colors.primary} />
              ) : (
                <MdFavoriteBorder size={24} color={colors.foreground} />
              )}
            </button>
          )}
        </h2>
        <ButtonsContainer>
          <Button
            borderless
            onClick={() => {
              history.push(`/contato/${contact.id}/editar`);
            }}
          >
            <FiEdit2 size={20} />
          </Button>
          <Button borderless onClick={handleDelete}>
            <FiDelete size={20} />
          </Button>
        </ButtonsContainer>
      </ContactHeader>
      <ContactBody>
        <div>
          {contact.phones.length > 0 && (
            <Section>
              <FiPhone size={24} />
              <div>
                {contact.phones.map(({ number, description }) => (
                  <div key={number + description}>
                    <p>{number}</p>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
          {contact.emails.length > 0 && (
            <Section>
              <FiMail size={24} />
              <div>
                {contact.emails.map(({ email, description }) => (
                  <div key={email + description}>
                    <p>{email}</p>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}
          {contact.addresses.length > 0 && (
            <Section>
              <FiMapPin size={24} />
              <div>
                {contact.addresses.map(
                  ({
                    cep,
                    state,
                    city,
                    neighborhood,
                    address,
                    number,
                    complement,
                    description,
                  }) => (
                    <div key={cep + description}>
                      <p>
                        {neighborhood}
                        <br />
                        {address}, {number}
                        <br />
                        {city}, {state} {cep}
                        <br />
                        {complement}
                      </p>
                      <span>{description}</span>
                    </div>
                  ),
                )}
              </div>
            </Section>
          )}
        </div>
        <div>
          {contact.categories.length > 0 && (
            <Section>
              <FiTag size={24} />
              <div>
                {contact.categories.map(({ name }) => (
                  <div key={name}>
                    <p>{name}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}
          {contact.birthday && (
            <Section>
              <FiGift size={24} />
              <div>
                <p>{format(contact.birthday, 'dd/MM/yyyy')}</p>
              </div>
            </Section>
          )}
          {contact.observation && (
            <Section>
              <FiMessageSquare size={24} />
              <div>
                <p>{contact.observation}</p>
              </div>
            </Section>
          )}
        </div>
      </ContactBody>
    </Container>
  );
};

export default ViewContact;
