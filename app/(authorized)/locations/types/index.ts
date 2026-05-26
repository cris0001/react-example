export interface Location {
  id: number
  firma: string
  nazwa: string
  adres1: string
  adres2: string
  sposobOdb: 1 | 2 | 3
  usuniety: boolean
  gpsLat: number | null
  gpsLng: number | null
  dataWpisu?: string
  dataZmiany?: string
}

export type OdbMode = 1 | 2 | 3

export const ODB_LABELS: Record<OdbMode, string> = {
  1: "Telefon",
  2: "QR kod",
  3: "Telefon + QR",
}

export interface CreateLocationPayload {
  nazwa: string
  adres1: string
  adres2: string
  sposobOdb: OdbMode
  gpsLat: number
  gpsLng: number
}
