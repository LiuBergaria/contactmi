import styled from 'styled-components/native';

interface ContainerProps {
  preset: 'normal' | 'inverted' | 'onlyText';
}

export const Container = styled.TouchableOpacity<ContainerProps>`
  width: 100%;

  background-color: ${({ preset, theme }) => {
    if (preset === 'onlyText') return 'transparent';

    if (preset === 'inverted') return theme.background2;

    return theme.primary;
  }};

  padding: 12px 16px;
  border-radius: 8px;
`;

interface TitleProps {
  preset: 'normal' | 'inverted' | 'onlyText';
}

export const Title = styled.Text<TitleProps>`
  color: ${({ preset, theme }) => {
    if (preset === 'onlyText' || preset === 'inverted') return theme.primary;

    return theme.background;
  }};

  font-weight: bold;

  font-size: 16px;
  text-align: center;
`;
