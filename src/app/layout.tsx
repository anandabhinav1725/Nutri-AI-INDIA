import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Nutri AI India",
  description: "Conversational nutrition logging prototype for Indian meals"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
