import type { Metadata } from "next";
import { Providers } from './providers'
import './globals.css'
import './themes.css'
import ThemeProviderWrapper from '@/shared/components/providers/ThemeProviderWrapper'

export const metadata: Metadata = {
  title: "Wheel of Islam - Frontend V2",
  description: "Wheel of Islam application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning={true}>
        <ThemeProviderWrapper>
          <Providers>
            {children}
          </Providers>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}

