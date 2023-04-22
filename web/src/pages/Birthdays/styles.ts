import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  width: 100%;
  color: ${({ theme }) => theme.foreground};

  > div:nth-child(1) {
    width: 100%;
    padding: 32px 16px 48px;
    border-radius: 0 0 100% 100%;

    background: ${({ theme }) => theme.background2};

    h2 {
      text-align: center;
    }

    span {
      display: block;
      margin-top: 8px;
      text-align: center;
    }
  }

  > div:nth-child(2) {
    margin: 24px auto;
    display: flex;
    align-items: flex-start;

    > div {
      width: 300px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      > svg {
        color: ${({ theme }) => theme.primary};
      }

      h3 {
        margin: 8px auto;
        font-size: 1.2rem;
      }

      > div {
        width: 100%;
      }
    }
  }
`;
