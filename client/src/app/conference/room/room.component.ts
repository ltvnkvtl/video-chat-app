import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {io, Socket} from "socket.io-client";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit {
  private socket: Socket;
  public users: any;
  public isAlreadyCalling = false;
  peerConnection = new RTCPeerConnection();
  @ViewChild("localVideo") public localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild("remoteVideo") public remoteVideo!: ElementRef<HTMLVideoElement>;

  constructor() {
    this.socket = io('http://localhost:3030', { transports: ["websocket"]});
    this.socket.on('log', (data) => console.log(data));
  }

  public ngOnInit() {
    this.socket.on("update-user-list", ({ users }) => {
      this.users = users;
    });
    this.socket.on("call-made", async data => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(new RTCSessionDescription(answer));

      this.socket.emit("make-answer", {
        answer,
        to: data.socket
      });
    });
    this.socket.on("answer-made", async data => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      if (!this.isAlreadyCalling) {
        await this.callUser(data.socket);
        this.isAlreadyCalling = true;
      }
    });
  }

  public ngAfterViewInit(): void {
    navigator.mediaDevices.getUserMedia({audio: false, video: true}).then(
      stream => {
        this.localVideo.nativeElement.srcObject = stream;
        stream.getTracks().forEach(track => this.peerConnection.addTrack(track, stream));
      },
      error => console.error('Error getting userMedia', error)
    )
    this.peerConnection.ontrack = ({ streams: [stream] }) => {
      this.remoteVideo.nativeElement.srcObject = stream;
    };
  }

  public async callUser(socketId: string) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    this.socket.emit("call-user", {
      offer,
      to: socketId
    });
  }
}
