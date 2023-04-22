import { Form } from '@unform/web';
import styled from 'styled-components';

export const Container = styled(Form)`
  color: ${({ theme }) => theme.foreground};
`;

export const ContactHeader = styled.div`
  position: relative;

  width: 100%;
  padding: 24px 16px 36px;
  border-radius: 0 0 100% 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  background: ${({ theme }) => theme.background2};

  > div {
    &:nth-child(1) {
      label {
        width: 80px;
        height: 80px;

        display: flex;
        justify-content: center;
        align-items: center;
      }

      border-radius: 50%;

      border: 2px solid ${({ theme }) => theme.foreground2};
      color: ${({ theme }) => theme.foreground2};

      cursor: pointer;
    }

    &:nth-child(2) {
      margin-left: 24px;
      min-width: 250px;
    }
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;

    border-radius: 50%;
  }

  h2 {
    color: ${({ theme }) => theme.foreground};
    display: flex;
    align-items: center;

    text-align: center;

    button {
      background: transparent;
    }

    svg {
      margin-left: 8px;
    }
  }
`;

export const ContactBody = styled.div`
  margin-top: 32px;

  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 960px) {
    flex-direction: row;
    align-items: flex-start;
  }

  > div {
    margin: 0 32px 24px;
  }
`;

export const Section = styled.div`
  width: 300px;

  display: flex;
  align-items: flex-start;

  & + div {
    margin-top: 24px;
  }

  > div {
    margin-left: 16px;

    > div {
      display: flex;
      align-items: center;

      & + div {
        margin-top: 8px;
      }
    }
  }

  svg {
    color: ${({ theme }) => theme.primary};
  }

  > svg {
    min-width: 24px;
    margin-top: 16px;
  }
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const TagContainer = styled.div`
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  margin-right: 8px;
  margin-bottom: 8px;

  svg {
    margin-left: 8px;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 0 16px 24px;

  > button {
    max-width: 200px;

    + button {
      margin-left: 8px;
    }
  }
`;
