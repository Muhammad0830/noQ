import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

import "../globals.css";
import "../toast.css";

import AppProviders from "./providers";
import AppShell from "@/components/AppShell";
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
      suppressHydrationWarning
      className="font-sans"
    >
      <body
        suppressHydrationWarning
        className="antialiased font-sans"
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
