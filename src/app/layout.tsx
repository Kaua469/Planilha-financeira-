import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Kadron Finance | Gestão Financeira Premium",
  description: "O sistema completo para sua inteligência financeira pessoal e corporativa.",
};

import { FinancialProvider } from "@/lib/context/financial-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} dark h-full antialiased`}
      style={{ colorScheme: 'dark' }}
    >
      <body className="min-h-full flex flex-col font-sans">
        <FinancialProvider>
          {children}
        </FinancialProvider>
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
