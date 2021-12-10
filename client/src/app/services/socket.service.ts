import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import {ACTIONS} from "../models/socket-actions";

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
  public socket: Socket;
  public messages: string[] = [];
  public peerConnections: { [key: string]: RTCPeerConnection} = {};
  public localMediaStream: any;
  public peerMediaElements: any;
  public clients: any[] = [];

  constructor() {
    this.socket = io('http://localhost:3030', { transports: ["websocket"]});
    this.socket.on(ACTIONS.ADD_PEER, this.handleNewPeer);
    this.socket.on(ACTIONS.ICE_CANDIDATE, ({peerID, iceCandidate}) => {
      this.peerConnections[peerID]?.addIceCandidate(
        new RTCIceCandidate(iceCandidate)
      );
    });
    this.socket.on(ACTIONS.SESSION_DESCRIPTION, async ({peerID, sessionDescription: remoteDescription}) => {
      await this.peerConnections[peerID]?.setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );

      if (remoteDescription.type === 'offer') {
        const answer = await this.peerConnections[peerID].createAnswer();

        await this.peerConnections[peerID].setLocalDescription(answer);

        this.socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: answer,
        });
      }
    })
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

  public async handleNewPeer({ peerID, createOffer} : { peerID: string, createOffer: boolean }): Promise<any> {
        if (peerID in this.peerConnections) {
          return console.warn(`Already connected to peer ${peerID}`);
        }
        this.peerConnections[peerID] = new RTCPeerConnection(this.configuration);

        this.peerConnections[peerID].onicecandidate = (event) => {
          if (event.candidate) {
            this.socket.emit(ACTIONS.RELAY_ICE, {
              peerID,
              iceCandidate: event.candidate,
            });
          }
        }

    let tracksNumber = 0;
    this.peerConnections[peerID].ontrack = ({streams: [remoteStream]}) => {
      tracksNumber++

      if (tracksNumber === 2) { // video & audio tracks received
        tracksNumber = 0;

        this.peerMediaElements[peerID].srcObject = remoteStream;
        if (!this.clients.includes(peerID)) {
          this.clients = [
            ...this.clients,
            peerID,
          ]
        }
      }
    }

    this.localMediaStream.getTracks().forEach((track: any) => {
      this.peerConnections[peerID].addTrack(track, this.localMediaStream);
    });

    if (createOffer) {
      const offer = await this.peerConnections[peerID].createOffer();

      await this.peerConnections[peerID].setLocalDescription(offer);

      this.socket.emit(ACTIONS.RELAY_SDP, {
        peerID,
        sessionDescription: offer,
      });
    }
  }

  public sendMessage(msg: string) {
    this.socket.emit('message', msg);
  }

  public joinRoom(roomId: string): void {
    this.socket.emit(ACTIONS.JOIN, roomId);
  }
}
