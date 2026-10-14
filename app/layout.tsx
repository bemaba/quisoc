import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QUI SOC DARRERE LA PANTALLA?",
  description: "Descobreix què hi ha més enllà dels likes. Un repte per mirar les xarxes amb uns altres ulls.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ca">
      <body>{children}</body>
    </html>
  );
}