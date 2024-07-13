import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import clsx from 'clsx';

import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          'font-sans antialiased min-h-screen bg-gradient-to-b from-white to-[#EAF1FF]',
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'light' }}>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />

            <main className="container mx-auto max-w-7xl px-6 flex-grow ">
              {children}
            </main>
            <footer className="w-full flex items-center justify-center pt-8">
              <span className="text-default-600 pb-8">
                © 2024. All rights reserved.
              </span>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
