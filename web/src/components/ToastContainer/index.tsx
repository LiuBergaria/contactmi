import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';

import { Container } from './styles';

import { ToastMessage } from '../../hooks/toast';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: { right: '-100%', transform: 'scale(0)' },
      enter: { right: '0%', transform: 'scale(1)' },
      leave: { right: '-100%', transform: 'scale(0)' },
    },
  );

  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} message={item} style={props} />
      ))}
    </Container>
  );
};

export default ToastContainer;
