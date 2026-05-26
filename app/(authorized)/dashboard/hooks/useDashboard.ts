import { useQuery } from "@tanstack/react-query"
import { api } from "@/utils/api"

export interface DashboardItem {
  id: number
  firma: string
  tresc: string
  temat: string
  dataWpisu: string
  status: 0 | 1 | 2
}

export interface DashboardPage {
  content: DashboardItem[]
  last: boolean
  size: number
}

export const dashboardKeys = {
  activity: (page: number) => ["dashboard", "activity", page] as const,
}

export function useDashboardActivity(page: number, size = 10) {
  return useQuery<DashboardPage>({
    queryKey: dashboardKeys.activity(page),
    queryFn: async () => {
      const { data } = await api.get(
        `dashboard/getDashboardData?page=${page - 1}&size=${size}`
      )
      return data
    },
    // Dashboard to live data - krótszy staleTime
    staleTime: 15_000,
  })
}
