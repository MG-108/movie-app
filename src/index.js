import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import App from './components/App';

const theme = createTheme({});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
  // eslint-disable-next-line comma-dangle
  document.getElementById('root')
);
