import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background-color: #F7F7F7;
    -webkit-font-smoothing: antialiased;
    /* min-height: 100vh; */
  }

  body, input, button {
    font-family: 'Roboto', sans-serif;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
    border: none;
  }

  ul, ol {
    list-style-type: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
