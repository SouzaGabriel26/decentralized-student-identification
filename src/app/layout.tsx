import { BaseStyles, ThemeProvider } from '@primer/react';
import type { Metadata } from 'next';
import './globals.css';
import StyledComponentsRegistry from './StyledComponentsRegistry';

export const metadata: Metadata = {
  title: 'Site Institucional',
  description: 'TCC - Site Institucional',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <BaseStyles>
              {children}
            </BaseStyles>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
