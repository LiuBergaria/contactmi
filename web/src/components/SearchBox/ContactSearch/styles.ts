import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;

  color: ${({ theme }) => theme.foreground};

  &:hover {
    background-color: ${({ theme }) => theme.background2};
  }

  transition: background-color 0.2s;

  cursor: pointer;

  > img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
  }

  > div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;

    > span {
      &:nth-child(1) {
        display: flex;
        align-items: center;
        color: ${({ theme }) => theme.foreground};

        svg {
          margin-left: 8px;
          color: ${({ theme }) => theme.primary};
        }
      }

      &:nth-child(2) {
        color: ${({ theme }) => theme.foreground2};
      }
    }
  }
`;
