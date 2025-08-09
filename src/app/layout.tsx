import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from '@/lib/AntdRegistry';
import { TeamProvider } from "@/context/TeamProvider";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Dashboard",
  description: "Manage your team and tasks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <StyledComponentsRegistry>
          <TeamProvider>
            {children}
          </TeamProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
