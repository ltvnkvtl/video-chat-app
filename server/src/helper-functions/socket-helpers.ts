import {Server as SocketIOServer, Socket} from "socket.io";
import {ACTIONS} from "../models/socket-actions";
import { version, validate } from "uuid";

export function getClientRooms(io: SocketIOServer) {
  const { rooms } = io.sockets.adapter;

  return Array.from(rooms.keys()).filter(roomId => validate(roomId) && version(roomId) === 4);
}

export function shareRoomsInfo(io: SocketIOServer, socket: Socket) {
  socket.emit(ACTIONS.SHARE_ROOMS, getClientRooms(io))
}

export function leaveRoom(io: SocketIOServer, socket: Socket) {
  return () => {
    const { rooms } = socket;
    Array.from(rooms).forEach(roomID => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

      clients.forEach(clientID => {
        io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
          peerID: socket.id,
        })

        socket.emit(ACTIONS.REMOVE_PEER, {
          peerID: clientID,
        })
      });
      socket.leave(roomID);
    });

    shareRoomsInfo(io, socket);
  }
}
