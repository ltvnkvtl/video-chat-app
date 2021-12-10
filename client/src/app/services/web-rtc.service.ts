import { Injectable } from '@angular/core';
import {SocketService} from "./socket.service";

@Injectable()
export class WebRTCService {
  private peerConnections!;
  private localMediaStreem!;
  private peerMediaElements!;

  constructor(private socket: SocketService) { }

  public async startCapture(roomId: string) {
    try {
      this.localMediaStreem.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 1280,
          height: 720,
        }
      });
      this.socket.joinRoom(roomId);
    } catch (e) {
      console.error('Error getting userMedia:', e);
    }

  }

  public addNewClient(): void {

  }
}
