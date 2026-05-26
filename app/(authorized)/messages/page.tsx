"use client"

import { useState } from "react"
import { MessageSquare, Radio } from "lucide-react"
import { useEmployees } from "@/app/(authorized)/employees/hooks/useEmployees"
import { useJobPositions } from "@/app/(authorized)/employees/hooks/useEmployees"
import { useMessagesParams } from "./hooks/useMessages"
import { ContactList } from "./components/ContactList"
import { ChatWindow } from "./components/ChatWindow"
import { BroadcastPanel } from "./components/BroadcastPanel"
import { cn } from "@/utils/helpers"

type MessagesTab = "chat" | "broadcast"

export default function MessagesPage() {
  const { selectedId, page, selectUser, clearUser } = useMessagesParams()
  const [tab, setTab] = useState<MessagesTab>("chat")

  // Ładujemy wszystkich pracowników - potrzebujemy do contact list i broadcast
  const { data: employeesData } = useEmployees(1, 999)
  const { data: jobPositions = [] } = useJobPositions()
  const employees = employeesData?.content ?? []

  const selectedEmployee = employees.find((e) => e.id === selectedId) ?? null

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col">

      {/* Nagłówek + tabs */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-xl font-bold text-foreground">Wiadomości</h1>

        <div className="flex gap-1 bg-muted/60 rounded-lg p-1">
          <button
            onClick={() => setTab("chat")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              tab === "chat" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Czat
          </button>
          <button
            onClick={() => setTab("broadcast")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              tab === "broadcast" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Radio className="w-3.5 h-3.5" />
            Broadcast
          </button>
        </div>
      </div>

      {/* Chat */}
      {tab === "chat" && (
        <div className="flex-1 min-h-0 border border-border rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-[280px_1fr]">

          {/* Lista kontaktów - ukryta na mobile gdy wybrany kontakt */}
          <div className={cn(
            "h-full overflow-hidden",
            selectedEmployee ? "hidden sm:block" : "block"
          )}>
            <ContactList
              employees={employees}
              selectedId={selectedId}
              onSelect={selectUser}
            />
          </div>

          {/* Chat window */}
          {selectedEmployee ? (
            <ChatWindow
              employee={selectedEmployee}
              page={page}
              onBack={clearUser}
            />
          ) : (
            <div className="hidden sm:flex items-center justify-center h-full text-sm text-muted-foreground">
              Wybierz pracownika aby zobaczyć wiadomości
            </div>
          )}
        </div>
      )}

      {/* Broadcast */}
      {tab === "broadcast" && (
        <div className="flex-1 min-h-0 border border-border rounded-2xl overflow-y-auto">
          <BroadcastPanel employees={employees} jobPositions={jobPositions} />
        </div>
      )}
    </div>
  )
}
