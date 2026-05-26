"use client"

import { Plus, Loader2, AlertCircle, Users } from "lucide-react"
import { useEmployees } from "./hooks/useEmployees"
import { useEmployeeModals } from "./hooks/useEmployeeModals"
import EmployeeRow from "./components/EmployeeRow"
import { NewEmployeeModal } from "./components/NewEmployeeModal"
import { EditEmployeeModal } from "./components/EditEmployeeModal"
import { Pagination } from "@/components/Pagination"

export default function EmployeesPage() {
  const { modal, editId, page, openModal, onEditEmployee } = useEmployeeModals()
  const { data, isLoading, isError, error } = useEmployees(page, 20)

  const employees = data?.content ?? []

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Pracownicy</h1>
          {data && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.totalElements} {data.totalElements === 1 ? "pracownik" : "pracowników"}
            </p>
          )}
        </div>
        <button
          onClick={() => openModal("new")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Dodaj</span>
        </button>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Ładowanie pracowników…</p>
        </div>
      )}

      {isError && (
        <div className="flex items-start gap-3 text-sm bg-destructive/8 border border-destructive/20 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
          <span className="text-destructive">
            {(error as any)?.response?.data?.message ?? "Nie udało się pobrać listy pracowników."}
          </span>
        </div>
      )}

      {!isLoading && !isError && employees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Brak pracowników</p>
          <p className="text-xs text-muted-foreground">Dodaj pierwszego pracownika klikając przycisk powyżej</p>
        </div>
      )}

      {!isLoading && !isError && employees.length > 0 && (
        <>
          <div className="space-y-2">
            {employees.map((emp) => (
              <EmployeeRow key={emp.id} employee={emp} onEdit={onEditEmployee} />
            ))}
          </div>
          <Pagination last={data?.last ?? true} />
        </>
      )}

      {modal === "new" && <NewEmployeeModal />}
      {modal === "edit" && editId > 0 && <EditEmployeeModal id={editId} />}
    </div>
  )
}
