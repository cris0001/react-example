"use client"

import { ProtectedRoute } from "@/components/ProtectedRoute"
import type { ReactNode } from "react"
import {Sidebar} from "@/app/(authorized)/components/Sidebar";
import {Navbar} from "@/app/(authorized)/components/Navbar";

export default function AuthorizedLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="grid grid-cols-[auto_1fr] h-dvh overflow-hidden bg-background">

        <aside className="sticky top-0 h-dvh">
          <Sidebar />
        </aside>

        <div className="flex flex-col min-w-0 overflow-hidden">

          <header className="sticky top-0 z-20 shrink-0">
            <Navbar />
          </header>

          {/* w-full żeby content zajmował całą szerokość prawej kolumny.
              Każda strona sama decyduje czy chce max-w-* czy pełną szerokość. */}
          <main className="flex-1 overflow-y-auto w-full">
            {children}
          </main>

        </div>
      </div>
    </ProtectedRoute>
  )
}
