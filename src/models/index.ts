export enum NotificationType {
  ORDER = 'order',
  MESSAGE = 'message',
}

export type Notification = {
  type: NotificationType
  message: string
  date: string
  url: string
}
