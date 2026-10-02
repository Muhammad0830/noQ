import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  Playfair_Display,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "../globals.css";
import "../toast.css";

import AppProviders from "./providers";
import AppShell from "@/components/AppShell";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoQ - Navbatsiz xizmat",
  description: "O'zingizga kerakli xizmatni toping va onlayn band qiling",
  icons: {
    icon: "/logo/noq_logo.png",
    shortcut: "/logo/noq_logo.png",
    apple: "/logo/noq_logo.png",
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  const htmlLang =
    locale === "uz-latn" ? "uz-Latn" : locale === "uz-cyrl" ? "uz-Cyrl" : "ru";

  return (
    <html
      lang={htmlLang}
      suppressHydrationWarning
      className={cn(
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            <AppShell>{children}</AppShell>
            <Toaster />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
