import type { Metadata } from 'next';

import './globals.css';
import { AuthProvider } from '../sections/auth/auth-forms/AuthContext'; // Adjust the path as needed

// PROJECT IMPORTS
import ProviderWrapper from './ProviderWrapper';

export const metadata: Metadata = {
  title: 'Lokahi Care',
  description: 'Lokahi Care'
};

export default function RootLayout({ children }: { children: React.ReactElement }) {
  return (
    <html lang="en">
      <body>
      <AuthProvider>
        <ProviderWrapper>{children}</ProviderWrapper>
      </AuthProvider>
      </body>
    </html>
  );
}