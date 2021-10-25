export enum NotificationType {
  ORDER = 'order',
  MESSAGE = 'message',
}

export type Notification = {
  _id: string
  type: NotificationType
  message: string
  date: string
  url: string
  seen: boolean
  acted: boolean
}
