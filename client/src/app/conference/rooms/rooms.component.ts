import { Component, OnInit } from '@angular/core';
import {SocketService} from "../../services/socket.service";
import {Router} from "@angular/router";
import {generateUUID} from "../../helpers/uuid";

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit {
  public rooms$ = this.socket.activeRooms$();

  constructor(private socket: SocketService, private readonly router: Router) { }

  ngOnInit(): void {
  }

  public createNewRoom(): void {
    this.router.navigate(['/rooms', generateUUID()])
  }

  public joinRoom(roomId: string): void {
    this.router.navigate(['/rooms', roomId])
  }
}
