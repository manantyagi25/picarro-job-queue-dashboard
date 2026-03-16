import type { AppProps } from "next/app";
import "../app/globals.css";
import { ReactQueryProvider } from "@/utils/react-query-provider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryProvider>
      <Component {...pageProps} />
    </ReactQueryProvider>
  );
}

