import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { CalendarCheck } from "lucide-react";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Painel de Gestão de Eventos",
  description:
    "Acompanhe eventos, controle o acesso de participantes e visualize métricas.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-muted/30 min-h-full flex flex-col">
        <Providers>
          <header className="bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:px-6">
              <Link
                href="/events"
                className="flex items-center gap-2 font-semibold"
              >
                <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
                  <CalendarCheck className="size-5" />
                </span>
                <span>Painel de Eventos</span>
              </Link>
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
