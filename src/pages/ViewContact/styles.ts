import styled from 'styled-components';

export const Container = styled.div`
  color: ${({ theme }) => theme.foreground};
`;

export const ContactHeader = styled.div`
  position: relative;

  width: 100%;
  padding: 24px 16px 36px;
  border-radius: 0 0 100% 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  background: ${({ theme }) => theme.background2};

  img {
    width: 80px;
    height: 80px;
    object-fit: cover;

    border-radius: 50%;

    margin-bottom: 8px;
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

export const ButtonsContainer = styled.div`
  position: absolute;

  top: 8px;
  right: 8px;
  display: flex;

  color: ${({ theme }) => theme.primary};
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
    margin-bottom: 24px;
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
      & + div {
        margin-top: 8px;
      }

      p {
        font-size: 1rem;

        color: ${({ theme }) => theme.foreground};
      }

      span {
        font-family: 'Consolas', sans-serif;
        font-size: 0.9rem;
        text-transform: uppercase;

        color: ${({ theme }) => theme.foreground2};
      }
    }
  }

  svg {
    color: ${({ theme }) => theme.primary};
  }
`;
