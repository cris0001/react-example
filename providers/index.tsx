"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "next-themes"
import { queryClient } from "@/lib/query-client"
import type { ReactNode } from "react"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    // QueryClientProvider - jeden instancja QueryClient na całą aplikację
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>

      {/* DevTools tylko w dev - w produkcji automatycznie nie renderuje */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
