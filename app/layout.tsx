import { BaseStyles, theme, ThemeProvider } from '@primer/react';
import type { Metadata } from 'next';
import { PageLayout } from './page-layout';
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
          <ThemeProvider
            theme={theme}
            colorMode="dark"
            preventSSRMismatch
            nightScheme="dark_dimmed"
          >
            <BaseStyles>
              <PageLayout>{children}</PageLayout>
            </BaseStyles>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}