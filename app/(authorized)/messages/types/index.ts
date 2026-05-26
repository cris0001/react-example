export interface Message {
  id: number
  creationData: string
  fromName: string
  message: string
  odbiorcaId: number
  status: 0 | 1 | 2
  title: string
}

export interface MessagesPage {
  content: Message[]
  last: boolean
  size: number
}

export interface SendMessagePayload {
  title: string
  message: string
  recivers: { userId: number; fcmToken: string }[]
}

export interface Recipient {
  id: number
  fcmToken: string
  imie?: string
  nazwisko?: string
}
