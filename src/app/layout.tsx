import type { Metadata } from "next";
import { ReactQueryProvider } from "./react-query-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Picarro Job Queue Dashboard",
  description: "Monitor and manage Picarro job queues"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
