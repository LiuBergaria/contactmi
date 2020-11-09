import React from 'react';

import { AuthProvider } from './auth';
import { InformationsProvider } from './informations';
import { CustomThemeProvider } from './theme';
import { ToastProvider } from './toast';

const AppProvider: React.FC = ({ children }) => (
  <CustomThemeProvider>
    <ToastProvider>
      <AuthProvider>
        <InformationsProvider>{children}</InformationsProvider>
      </AuthProvider>
    </ToastProvider>
  </CustomThemeProvider>
);

export default AppProvider;
