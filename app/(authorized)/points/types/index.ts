export interface Point {
  id: number
  firma: string
  login: string
  nazwisko: string
  imie: string
  email: string
  telefon: string
  aktywny: boolean
  zablokowany: boolean
  dataWpisu: string
  dataZmiany: string
  wpisal: string
  zmienil: string
  pesel: string
  idStanow: number
}

export interface CreatePointPayload {
  imie: string
  nazwisko: string
  email: string
  password: string
  passwordConfirm: string
  idStanow: number
}

export interface UpdatePointPayload {
  id: number
  firma: string
  imie: string
  nazwisko: string
  email: string
}

export interface UpdatePointPasswordPayload {
  id: number
  firma: string
  password: string
  passwordConfirm: string
}
