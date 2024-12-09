"use client";

import {Merriweather} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from 'next-themes';
import Header from "./components/Header";
import ThemeCom from "./components/ThemeCom";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from '@clerk/localizations'

const meri = Merriweather({
  subsets: ['latin'],
  display: 'swap',
  weight: '300',
})
export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" suppressHydrationWarning>
        <body
          className={`${meri.variable }antialiased`}
        >
          <ThemeProvider>
            <ThemeCom>
              <Header />
              {children}
            </ThemeCom>
          
          </ThemeProvider>
        </body>
    </html>
    </ClerkProvider>
  );
}
