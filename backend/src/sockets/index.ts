import type { Server } from 'socket.io'

export const registerSocketHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    socket.on('hotel.join', (hotelId: string) => {
      if (!hotelId) {
        return
      }

      void socket.join(`hotel:${hotelId}:kitchen`)
      void socket.join(`hotel:${hotelId}:service`)
      void socket.join(`hotel:${hotelId}:notifications`)
    })

    socket.on('hotel.leave', (hotelId: string) => {
      if (!hotelId) {
        return
      }

      void socket.leave(`hotel:${hotelId}:kitchen`)
      void socket.leave(`hotel:${hotelId}:service`)
      void socket.leave(`hotel:${hotelId}:notifications`)
    })
  })
}
