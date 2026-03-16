"use client";

import { type ReactNode } from "react";
import {
  QueryClientProvider,
  ReactQueryDevtools
} from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query-client";

interface ReactQueryProviderProps {
  children: ReactNode;
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

