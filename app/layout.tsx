import { BaseStyles, theme, ThemeProvider } from '@primer/react';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { PageLayout } from './pageLayout';
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
    <html
      lang="pt-BR"
      suppressHydrationWarning
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      <body
        style={{
          height: '100%',
          width: '100%',
          overflowY: 'hidden',
        }}
      >
        <StyledComponentsRegistry>
          <ThemeProvider
            theme={theme}
            colorMode="dark"
            preventSSRMismatch
            nightScheme="dark_dimmed"
          >
            <BaseStyles>
              <PageLayout>
                {children}
                <Analytics />
              </PageLayout>
            </BaseStyles>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
