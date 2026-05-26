export interface SchedulerData {
  firma: string
  imie: string
  nazwisko: string
  pesel: string
  recno: number
  kontokosz: string
  pracownik: number
  kolor: number
  nazwa: string
  symbol: string
  dataZat: string
  dataZwol: string
  idStanow: number
  stanowisko: string
  tytul: string | null
  stanCz: string | null
  stanCzSymbol: string | null
  slowacja: number
  godzNom: number
  godzTyg: number
  godzMie: number
  wielEt: string
  godzDzi: number
  lok1: any; lok2: any; lok3: any; lok4: any; lok5: any; lok6: any; lok7: any
  nazwLok1: string; nazwLok2: string; nazwLok3: string; nazwLok4: string
  nazwLok5: string; nazwLok6: string; nazwLok7: string
  data1: string; data2: string; data3: string; data4: string
  data5: string; data6: string; data7: string
  planOd1: string; planOd2: string; planOd3: string; planOd4: string
  planOd5: string; planOd6: string; planOd7: string
  planDo1: string; planDo2: string; planDo3: string; planDo4: string
  planDo5: string; planDo6: string; planDo7: string
  symbolAbs1: string; symbolAbs2: string; symbolAbs3: string; symbolAbs4: string
  symbolAbs5: string; symbolAbs6: string; symbolAbs7: string
  moznaEdytowac: boolean
  kolorCss?: string | null
  popTydz1: string | null; popTydz2: string | null; popTydz3: string | null
  popTydz4: string | null; popTydz5: string | null; popTydz6: string | null
  popTydz7: string | null
}

export interface ScheduleStatus {
  ok: number
  tresc: string
  imienazwisko: string
  data: string
}

export interface Location {
  id: number
  nazwa: string
  firma: string
}

export interface LeaveType {
  symbol: string
  nazwa: string
  czyNieOpis: string
  czyNieOpcje: [] | { text: string; value: string }[]
}

export type DayIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7
export const DAY_FIELDS: DayIndex[] = [1, 2, 3, 4, 5, 6, 7]

export type CellUpdate = {
  recno: number
  day: DayIndex
  planOd: string | null | undefined
  planDo: string | null | undefined
  lok: string | number | null | undefined
  nazwLok: string | null | undefined
}
