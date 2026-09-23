import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/themeContext";

export const metadata: Metadata = {
  title: "Æsculapius",
  description: "Онлайн аптека",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className="h-full" suppressHydrationWarning>
      <body className="antialiased h-full">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}