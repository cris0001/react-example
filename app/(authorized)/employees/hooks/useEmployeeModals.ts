"use client"

import { useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface UseEmployeeModalsReturn {
    modal: string | null
    editId: number
    page: number
    openModal: (type: "new" | "edit", id?: number) => void
    closeModal: () => void
    onEditEmployee: (id: number) => void
}

export function useEmployeeModals(): UseEmployeeModalsReturn {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const modal = searchParams.get("modal")
    const editId = Number(searchParams.get("id") ?? 0)
    const page = Number(searchParams.get("page") ?? 1)

    const openModal = useCallback(
        (type: "new" | "edit", id?: number) => {
            const params = new URLSearchParams(searchParams.toString())
            params.set("modal", type)
            if (id) params.set("id", String(id))
            else params.delete("id")
            router.push(`${pathname}?${params.toString()}`)
        },
        [pathname, router, searchParams]
    )

    const closeModal = useCallback(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("modal")
        params.delete("id")
        router.push(`${pathname}?${params.toString()}`)
    }, [pathname, router, searchParams])

    // useCallback - stabilna referencja dla memo w EmployeeRow
    const onEditEmployee = useCallback(
        (id: number) => openModal("edit", id),
        [openModal]
    )

    return { modal, editId, page, openModal, closeModal, onEditEmployee }
}