import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  > div:nth-child(2) {
    display: flex;

    flex: 1;
    overflow: auto;

    background: ${({ theme }) => theme.background};

    > div:last-child {
      flex: 1;
      height: 100%;
      overflow-y: auto;
    }
  }
`;
