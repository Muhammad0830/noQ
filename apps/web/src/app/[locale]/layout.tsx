import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "../globals.css";
import "../toast.css";

import AppProviders from "./providers";
import { Toaster } from "@/components/ui/sonner";

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

  return (
    <html
      lang={locale}
      className="font-sans"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="antialiased font-sans"
      >
        <NextIntlClientProvider messages={messages}>
          <AppProviders>
            <main className="min-h-dvh">{children}</main>
            <Toaster />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
