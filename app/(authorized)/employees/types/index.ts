export interface EmployeesData {
  fcmToken: string | null
  id: number
  firma: string
  login: string
  nazwisko: string
  imie: string
  email: string
  idStanow: number
  telefon: string
  aktywny: boolean
  zablokowany: boolean
  dataWpisu: string
  dataZmiany: string
  wpisal: string
  zmienil: string
}

export interface Employee {
  dataZatrudnienia: string
  role: string[]
  uzytkownik: {
    idStanow: number | null
    id: number
    firma: string
    login: string
    nazwisko: string
    imie: string
    email: string
    pesel: string
    telefon: string
    aktywny: boolean
    zablokowany: boolean
    dataWpisu: string
    dataZmiany: string
    wpisal: string
    zmienil: string
  }
}

export interface EmployeesPage {
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
  content: EmployeesData[]
}

export interface Role {
  rola: string
  rolaNazwa: string
  opis: string
}

export interface JobPosition {
  firma: string
  nazwa: string
  opis: string
  kolor: string
  id: number
}

export interface DismissalReason {
  nazwa: string
  symbol: string
}

export interface CreateEmployeePayload {
  imie: string
  nazwisko: string
  email: string
  telefon: string
  pesel: string
  idStanow: number
  doKadr: boolean
  czyTablet: boolean
  roles: string[]
  wymiarUrlopu: {
    rokKal: number
    dataZat: string
    dniZalegle: number
    wymiarUrl: number
  }
}

export interface UpdateEmployeePayload {
  updateType: "UPDATE_ALL" | "UPDATE_ROLES" | "UPDATE_USER"
  uzytkownik: {
    id: number
    firma: string
    login: string
    nazwisko: string
    imie: string
    email: string
    pesel: string
    telefon: string
    aktywny: boolean
    zablokowany: boolean
    dataWpisu: string
    dataZmiany: string
    wpisal: string
    zmienil: string
    idStanow: number
  }
  role: string[]
}

export interface RaportData {
  data: string
  planOd: string | null
  planDo: string | null
  realOd: string | null
  ralDo: string | null   // literówka z backendu
  absNazwa: string | null
  absSymbol: string | null
}

export interface LeavesData {
  recno: number
  poczAbs: string
  konAbs: string
  dniNieb: number
  nazwa: string
  uwagi: string | null
  czyZat: number
}

export interface LeaveEntitlements {
  wymiarRocznyDni: number
  zaleglyDni: number
  wykorzystano: number
  zostaloDni: number
}