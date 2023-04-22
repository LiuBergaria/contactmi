import React, { useMemo } from 'react';
import { FiGift } from 'react-icons/fi';
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { ptBR } from 'date-fns/locale';

import { useInformations } from '../../hooks/informations';
import ContactBirthday from './ContactBirthday';

import { Container } from './styles';

const Birthdays: React.FC = () => {
  const { getTodayBirthdays, getNextBirthdaysInMonth } = useInformations();

  const todayBirthdays = useMemo(() => getTodayBirthdays(), [
    getTodayBirthdays,
  ]);

  const monthBirthdays = useMemo(() => getNextBirthdaysInMonth(), [
    getNextBirthdaysInMonth,
  ]);

  const formattedDate = useMemo(
    () =>
      format(new Date(), "EEEE', dia 'dd' de 'MMMM' de 'yyyy", {
        locale: ptBR,
      }),
    [],
  );

  return (
    <Container>
      <div>
        <div>
          <h2>Seja bem-vindo!</h2>
          <span>{formattedDate}</span>
        </div>
      </div>
      <div>
        <div>
          <FiGift size={54} />
          <h3>Aniversários</h3>
          <div>
            {todayBirthdays.map(contact => (
              <ContactBirthday
                key={contact.id}
                id={contact.id}
                photo={contact.photoName}
                name={`${contact.name} ${contact.surname}`}
                birthday="Hoje"
              />
            ))}
          </div>
        </div>
        <div>
          <FiGift size={54} />
          <h3>Próximos Aniversários</h3>
          {monthBirthdays.map(contact => (
            <ContactBirthday
              key={contact.id}
              id={contact.id}
              photo={contact.photoName}
              name={`${contact.name} ${contact.surname}`}
              birthday={format(contact.birthday as Date, 'dd/MM')}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Birthdays;
