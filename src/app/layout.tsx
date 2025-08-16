import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Simulation App",
  description: "Interview simulation application for users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
