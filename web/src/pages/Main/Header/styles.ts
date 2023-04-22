import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;

  background: ${({ theme }) => theme.background};

  width: 100%;
  padding: 12px 24px;

  border-bottom: 1px solid ${({ theme }) => theme.foreground2};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  margin-left: auto;
`;

export const SearchContainer = styled.div`
  margin: 0 16px 0 64px;
  width: 100%;
  max-width: 600px;
`;
