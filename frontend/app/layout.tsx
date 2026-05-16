import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fake News Detector AI — Detect misinformation in seconds",
  description:
    "Production-grade machine learning that classifies news as real or fake in milliseconds. Built with TF-IDF + Logistic Regression and a polished analytics dashboard.",
  keywords: [
    "fake news detection",
    "AI",
    "machine learning",
    "NLP",
    "news classifier",
  ],
  authors: [{ name: "Fake News Detector AI" }],
  openGraph: {
    title: "Fake News Detector AI",
    description: "Detect fake news using AI in seconds.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-bg text-text antialiased">
        <Providers>
          {children}
          <Toaster
            theme="dark"
            position="top-right"
            toastOptions={{
              style: {
                background: "#161B22",
                border: "1px solid #30363D",
                color: "#E6EDF3",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
