import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react';
import _ from 'lodash';
import { getDate, getMonth, isAfter, isBefore } from 'date-fns';

import api from '../services/api';
import { useToast } from './toast';
import { useAuth } from './auth';

interface ContactData {
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

interface InformationsContextData {
  contacts: ContactData[];
  organizedContacts: { [key: string]: ContactData[] };
  getContactById(id: string): ContactData | undefined;
  getTodayBirthdays(): ContactData[];
  getNextBirthdaysInMonth(): ContactData[];
  updateContact(contact: ContactData): void;
  insertContact(contact: ContactData): void;
  updatePhoto(id: string, photo: string): void;
  removeContact(contact: ContactData): void;
}

interface InformationsData {
  contacts: ContactData[];
}

const InformationsContext = createContext<InformationsContextData>(
  {} as InformationsContextData,
);

const getContactKey = (name: string, isFavorite: boolean): string => {
  if (isFavorite) return 'FV';

  const letter = name[0].toUpperCase();

  if (/[A-Z]/gi.test(letter)) return letter;

  return 'CS';
};

export const InformationsProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<InformationsData>({
    contacts: [],
  } as InformationsData);

  const { addToast } = useToast();
  const { token } = useAuth();

  const getContactById = useCallback(
    (id: string) => data.contacts.find(contact => contact.id === id),
    [data.contacts],
  );

  const getTodayBirthdays = useCallback(() => {
    const today = new Date();
    const todayDay = getDate(today);
    const todayMonth = getMonth(today);

    return data.contacts.filter(
      contact =>
        contact.birthday &&
        getDate(contact.birthday) === todayDay &&
        getMonth(contact.birthday) === todayMonth,
    );
  }, [data.contacts]);

  const getNextBirthdaysInMonth = useCallback(() => {
    const today = new Date();
    const todayDay = getDate(today);
    const todayMonth = getMonth(today);

    return data.contacts.filter(
      contact =>
        contact.birthday &&
        isBefore(contact.birthday, today) &&
        getDate(contact.birthday) !== todayDay &&
        getMonth(contact.birthday) === todayMonth,
    );
  }, [data.contacts]);

  const organizedContacts = useMemo(() => {
    return _.groupBy(data.contacts, (contact: ContactData) =>
      getContactKey(contact.name, contact.isFavorite),
    );
  }, [data.contacts]);

  const updateContact = useCallback(
    (contact: ContactData) => {
      setData({
        contacts: data.contacts.map(oldContact =>
          oldContact.id === contact.id
            ? {
                ...contact,
                birthday: contact.birthday ? new Date(contact.birthday) : null,
              }
            : oldContact,
        ),
      });
    },
    [data.contacts],
  );

  const updatePhoto = useCallback(
    (id: string, photo: string) => {
      setData({
        contacts: data.contacts.map(oldContact =>
          oldContact.id === id
            ? { ...oldContact, photoName: photo }
            : oldContact,
        ),
      });
    },
    [data.contacts],
  );

  const insertContact = useCallback(
    (contact: ContactData) => {
      setData({
        contacts: [
          ...data.contacts,
          {
            ...contact,
            birthday: contact.birthday ? new Date(contact.birthday) : null,
          },
        ],
      });
    },
    [data.contacts],
  );

  const removeContact = useCallback(
    (contact: ContactData) => {
      setData({
        contacts: data.contacts.filter(
          oldContact => oldContact.id !== contact.id,
        ),
      });
    },
    [data.contacts],
  );

  const getContacts = useCallback(async () => {
    try {
      const response = await api.get('/contacts');

      if (response.status === 200) {
        setData({
          contacts: response.data.map((contact: any) => ({
            ...contact,
            birthday: contact.birthday ? new Date(contact.birthday) : null,
          })),
        });
      } else throw new Error('Erro ao buscar contatos');
    } catch (e) {
      addToast({
        type: 'error',
        title: 'Erro ao buscar contatos',
      });
    }
  }, [addToast]);

  useEffect(() => {
    if (token) getContacts();
  }, [getContacts, token]);

  return (
    <InformationsContext.Provider
      value={{
        contacts: data.contacts || [],
        getContactById,
        organizedContacts,
        getTodayBirthdays,
        getNextBirthdaysInMonth,
        updateContact,
        insertContact,
        updatePhoto,
        removeContact,
      }}
    >
      {children}
    </InformationsContext.Provider>
  );
};

export const useInformations = (): InformationsContextData => {
  const context = useContext(InformationsContext);

  if (!context) {
    throw new Error('useInformations must be used within a ToastProvider');
  }

  return context;
};
