export interface LeaveRequest {
  recno: number
  poczAbs: string
  konAbs: string
  pesel: string
  nieob: string
  nazwa: string
  dniNieb: number
  dniNier: number
  czyNie: string
  uwagi: string
  czyZat: number
  czySkan: number
  imie: string | null
  nazwisko: string | null
}

export interface LeaveCalendarData {
  yetToDecide: LeaveRequest[] | null
  accepted: LeaveRequest[] | null
}

export interface LeavesPage {
  content: LeaveRequest[]
  last: boolean
  size: number
}
