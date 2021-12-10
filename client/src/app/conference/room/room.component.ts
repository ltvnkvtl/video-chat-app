import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {SocketService} from "../../services/socket.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements AfterViewInit {
  private roomId!: string;
  // private localMediaStreem!;
  @ViewChild("localVideo") public localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild("remoteVideo") public remoteVideo!: ElementRef<HTMLVideoElement>;

  constructor(public readonly socket: SocketService,
              private route: ActivatedRoute) {
    this.roomId = this.route.snapshot.params['id'];
  }

  public ngAfterViewInit(): void {
    navigator.mediaDevices.getUserMedia({audio: false, video: true}).then(
      stream => {
        this.localVideo.nativeElement.srcObject = stream;
        this.socket.joinRoom(this.roomId);
      },
      error => console.error('Error getting userMedia', error)
    )
  }

}
