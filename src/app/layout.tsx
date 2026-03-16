import type { Metadata } from "next";
import { ReactQueryProvider } from "../utils/react-query-provider";
import { ThemeProvider } from "../utils/theme-provider";
import { Sidebar } from "../components/layout/Sidebar";
import "./globals.css";
import "../styles/ui.css";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ReactQueryProvider>
            <div className="flex h-screen w-full bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50 overflow-hidden">
              <Sidebar />
              <main className="flex-1 flex justify-center px-8 py-8">
                <div className="w-full space-y-6">
                  {children}
                </div>
              </main>
            </div>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
