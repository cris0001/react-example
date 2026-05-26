export type TaskStatus = "OPEN" | "IN_PROGRESS" | "DONE" | "CANCELLED"
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface Task {
  id: number
  firma: string
  temat: string
  tresc: string
  status: TaskStatus
  priorytet: TaskPriority
  dataUtworzenia: string
  dataModyfikacji: string
  dataRealizacji: string | null
  utworzyl: string
  przypisanyDo: string | null
  przypisanyDoImie: string | null
  przypisanyDoNazwisko: string | null
  liczbaKomentarzy: number
  liczbaZalacznikow: number
}

export interface TaskComment {
  id: number
  taskId: number
  tresc: string
  dataUtworzenia: string
  autor: string
  autorImie: string
  autorNazwisko: string
}

export interface TaskAttachment {
  id: number
  taskId: number
  nazwaPliku: string
  rozmiar: number
  dataUtworzenia: string
  autor: string
}

export interface TasksPage {
  content: Task[]
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface CreateTaskPayload {
  temat: string
  tresc: string
  priorytet: TaskPriority
  dataRealizacji: string | null
  przypisanyDo: string | null
}

export interface UpdateTaskPayload {
  temat: string
  tresc: string
  priorytet: TaskPriority
  status: TaskStatus
  dataRealizacji: string | null
  przypisanyDo: string | null
}
