import express, { Request, Response } from 'express'
import { config } from 'dotenv'
import { createServer } from 'http'
import { Server as IOServer } from 'socket.io'

config()

const app = express()
const server = createServer(app)
const io = new IOServer(server)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello!' })
})

io.on('connection', (socket) => {
  socket.on('notification', (notification) => {
    io.emit('notification', notification)
  })
})

server.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`)
})
