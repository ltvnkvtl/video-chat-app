import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import {ACTIONS} from "../models/socket-actions";
import {generateUUID} from "../helpers/uuid";

@Injectable()
export class SocketService {
  configuration: RTCConfiguration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  private socket: Socket;
  private messages: string[] = [];
  private peerConnections: { [key: string]: RTCPeerConnection} = {};

  constructor() {
    this.socket = io('http://localhost:3030', { transports: ["websocket"]});
  }

  public activeRooms$(): Observable<string[]> {
    return new Observable(observer => {
      this.socket.on(ACTIONS.SHARE_ROOMS, (rooms) => {
        console.log(rooms)
        observer.next(rooms);
      });
    });
  }

  public onMessage$(): Observable<string[]> {
    return new Observable(observer => {
      this.socket.on('message', msg => {
        this.messages.push(msg);
        observer.next(this.messages);
      });
    });
  }

  public joinRoom(roomId: string): void {
    this.socket.emit(ACTIONS.JOIN, roomId);
  }
}
