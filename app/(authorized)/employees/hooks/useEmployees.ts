import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/utils/api"
import { useAuthStore } from "@/store/auth.store"
import type {
  EmployeesPage,
  Employee,
  Role,
  JobPosition,
  DismissalReason,
  CreateEmployeePayload,
  UpdateEmployeePayload,
} from "../types"
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCallback} from "react";

// ---------------------------------------------------------------------------
// Query keys - centralne miejsce, łatwo invalidować
// ---------------------------------------------------------------------------
export const employeeKeys = {
  all: ["employees"] as const,
  list: (page: number, size: number) => ["employees", "list", page, size] as const,
  detail: (id: number) => ["employees", "detail", id] as const,
  roles: ["employees", "roles"] as const,
  jobPositions: ["employees", "job-positions"] as const,
  dismissReasons: ["employees", "dismiss-reasons"] as const,
}

// ---------------------------------------------------------------------------
// Lista pracowników (stronicowana)
// ---------------------------------------------------------------------------
export function useEmployees(page: number, size: number) {
  const firma = useAuthStore((s) => s.user?.firma)

  return useQuery<EmployeesPage>({
    queryKey: employeeKeys.list(page, size),
    queryFn: async () => {
      // POST z query params - tak samo jak w oryginale
      const { data } = await api.post(
        `user/adm/employees?page=${page - 1}&size=${size}&sort=nazwisko,asc`
      )
      return data
    },
    enabled: !!firma,
    // Dane listy trzymamy świeże przez 30s - lista zmienia się rzadko
    staleTime: 30_000,
  })
}

// ---------------------------------------------------------------------------
// Szczegóły jednego pracownika
// ---------------------------------------------------------------------------
export function useEmployee(id: number) {
  const firma = useAuthStore((s) => s.user?.firma)

  return useQuery<Employee>({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get(`user/adm/employee/${firma}/${id}`)
      return data
    },
    enabled: !!firma && !!id,
  })
}

// ---------------------------------------------------------------------------
// Dostępne role
// ---------------------------------------------------------------------------
export function useRoles() {
  return useQuery<Role[]>({
    queryKey: employeeKeys.roles,
    queryFn: async () => {
      const { data } = await api.get("user/adm/getRoles")
      return data
    },
    // Role się nie zmieniają - cache na 1h
    staleTime: 60 * 60_000,
  })
}

// ---------------------------------------------------------------------------
// Stanowiska pracy
// ---------------------------------------------------------------------------
export function useJobPositions() {
  return useQuery<JobPosition[]>({
    queryKey: employeeKeys.jobPositions,
    queryFn: async () => {
      const { data } = await api.get("user/adm/jobtitles")
      return data
    },
    staleTime: 60 * 60_000,
  })
}

// ---------------------------------------------------------------------------
// Powody zwolnienia
// ---------------------------------------------------------------------------
export function useDismissReasons() {
  return useQuery<DismissalReason[]>({
    queryKey: employeeKeys.dismissReasons,
    queryFn: async () => {
      const { data } = await api.get("user/adm/hr/dismissal-reasons")
      return data
    },
    staleTime: 60 * 60_000,
  })
}

// ---------------------------------------------------------------------------
// Mutacja: dodaj pracownika
// useMemo NIE jest potrzebny - obiekt mutacji jest stabilny z React Query
// ---------------------------------------------------------------------------
export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateEmployeePayload) =>
      api.post("user/adm/createEmployee", payload),

    onSuccess: () => {
      // Invalidujemy całą listę pracowników po dodaniu
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

// ---------------------------------------------------------------------------
// Mutacja: aktualizuj pracownika
// ---------------------------------------------------------------------------
export function useUpdateEmployee() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma)

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateEmployeePayload }) =>
      api.put(`user/adm/employee/${firma}/${id}/update`, payload),

    onSuccess: (_data, { id }) => {
      // Invalidujemy szczegóły tego pracownika i całą listę
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}

// ---------------------------------------------------------------------------
// Mutacja: zwolnij pracownika
// ---------------------------------------------------------------------------
export function useDismissEmployee() {
  const queryClient = useQueryClient()
  const firma = useAuthStore((s) => s.user?.firma)

  return useMutation({
    mutationFn: ({
      id,
      reason,
      date,
    }: {
      id: number
      reason: string
      date: string
    }) =>
      api.put(`user/adm/employee/${firma}/${id}/dismiss`, {
        powod: reason,
        dataZwol: date,
      }),

    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: employeeKeys.all })
    },
  })
}


