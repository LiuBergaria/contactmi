import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  min-width: 450px;
  height: 100%;

  @media (max-width: 959px) {
    width: 100%;
  }

  display: flex;
  flex-direction: column;
`;

export const LetterSelection = styled.div`
  display: flex;
  flex-direction: column;

  position: absolute;

  top: 16px;
  right: 24px;
  border-radius: 16px;
  padding: 8px 0;

  background: ${({ theme }) => theme.background};

  z-index: 99;

  > button {
    background: transparent;
    padding: 2px 8px;
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.foreground2};

    &:hover {
      color: ${({ theme }) => theme.primary};
    }

    > svg {
      width: 16px;
    }
  }
`;

export const ContactsContainer = styled.div`
  overflow-y: auto;
`;

export const AddButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: #fff;

  border-radius: 50%;

  position: absolute;
  bottom: 24px;
  right: 24px;

  width: 64px;
  height: 64px;

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 100;
`;
