import express, { Request, Response } from 'express'
import { config } from 'dotenv'
import { createServer } from 'http'
import { Server as IOServer } from 'socket.io'
import { createClient } from 'redis'
import { promisify } from 'util'
import { Notification } from './models'

config()

const app = express()
const server = createServer(app)
const ioOptions: any = { cors: true }
const io = new IOServer(server, ioOptions)

const redisClient = createClient({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  //password: process.env.REDIS_PASSWORD,
})

const redisGetAsync = promisify(redisClient.get).bind(redisClient)

const saveNotification = async (notification: Notification) => {
  const notificationsHistory = await redisGetAsync('notifications')
  let notifications: Array<any> = []

  if (notificationsHistory) {
    notifications = JSON.parse(notificationsHistory)
  }

  notifications.push(notification)
  redisClient.set('notifications', JSON.stringify(notifications))
}

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello!' })
})

io.on('connection', (socket) => {
  socket.on('joinRoom', async (room: string) => {
    const roomHistory = await redisGetAsync(room)
    if (!roomHistory) return
    const history = JSON.parse(roomHistory)
    socket.emit('roomHistory', history)
  })

  socket.on('notification', (notification) => {
    saveNotification(notification)
    io.emit('notification', notification)
  })
})

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`)
})
