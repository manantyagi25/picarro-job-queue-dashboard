import type { Metadata } from "next";
import { ReactQueryProvider } from "../utils/react-query-provider";
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
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden">
            <Sidebar />
            <main className="flex-1 flex justify-center px-8 py-8">
              <div className="w-full max-w-[1100px] space-y-6 pb-8">
                {children}
              </div>
            </main>
          </div>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
