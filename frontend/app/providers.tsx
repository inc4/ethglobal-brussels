'use client';

import * as React from 'react';
import { NextUIProvider } from '@nextui-org/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';

import Web3ModalProvider from '@/components/Web3ModalProvidex';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

import { SafeInfoContextProvider } from "@/context/SafeInfoContextProvider";

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <Web3ModalProvider>
      <SafeInfoContextProvider>
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
        </NextUIProvider>
      </SafeInfoContextProvider>
    </Web3ModalProvider>
  );
}
