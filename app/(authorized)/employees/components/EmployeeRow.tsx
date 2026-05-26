"use client"

import { memo } from "react"
import { useRouter } from "next/navigation"
import { Edit, Mail, LockKeyhole } from "lucide-react"
import { cn } from "@/utils/helpers"
import type { EmployeesData } from "../types"
import { useEmployeeModals } from "@/app/(authorized)/employees/hooks/useEmployeeModals"

interface EmployeeRowProps {
    employee: EmployeesData
    onEdit: (id: number) => void

}


function areEqual(prev: EmployeeRowProps, next: EmployeeRowProps) {
    return (
        prev.employee.id === next.employee.id &&
        prev.employee.imie === next.employee.imie &&
        prev.employee.nazwisko === next.employee.nazwisko &&
        prev.employee.email === next.employee.email &&
        prev.employee.zablokowany === next.employee.zablokowany &&
        prev.employee.fcmToken === next.employee.fcmToken
    )
}

function EmployeeRow({ employee,onEdit }: EmployeeRowProps) {
    console.log("render:", employee.id, employee.nazwisko)

    const router = useRouter()

    const initials = `${employee.imie?.[0] ?? ""}${employee.nazwisko?.[0] ?? ""}`.toUpperCase()

    const goToDetails = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("button, a, [data-no-nav]")) return
        router.push(`/employees/${employee.id}/raport`)
    }

    return (
        <div
            onClick={goToDetails}
            className={cn(
                "flex items-center justify-between gap-3 px-4 py-3",
                "rounded-xl border border-border bg-card",
                "hover:bg-muted/50 hover:shadow-sm hover:-translate-y-px",
                "transition-all duration-150 cursor-pointer"
            )}
        >
            <div className="flex items-center gap-3 min-w-0">
                <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold border border-primary/10">
                    {initials}
                </div>

                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
                "text-sm font-medium text-foreground",
                employee.zablokowany && "line-through opacity-50"
            )}>
              {employee.imie} {employee.nazwisko}
            </span>
                        {employee.zablokowany && (
                            <>
                                <LockKeyhole className="w-3 h-3 text-destructive sm:hidden" />
                                <span className="hidden sm:inline text-[11px] font-medium px-1.5 py-0.5 rounded-full bg-destructive/10 text-destructive">
                  Zablokowany
                </span>
                            </>
                        )}
                    </div>
                    <p className={cn(
                        "text-xs text-muted-foreground truncate mt-0.5",
                        employee.zablokowany && "line-through opacity-40"
                    )}>
                        {employee.email}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
                {employee.fcmToken && (
                    <button
                        data-no-nav
                        onClick={() => router.push(`/messages?open=${employee.id}`)}
                        title="Wiadomość"
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                        <Mail className="w-4 h-4" />
                    </button>
                )}
                <button
                    data-no-nav
                    onClick={() => onEdit(employee.id)}
                    title="Edytuj"
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    data-no-nav
                    onClick={() => router.push(`/employees/${employee.id}/raport`)}
                    className="hidden sm:block text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1"
                >
                    Szczegóły →
                </button>
            </div>
        </div>
    )
}

// Comparator sprawdza tylko pola danych - onEdit nie jest propem więc go pomijamy


export default memo(EmployeeRow, areEqual)