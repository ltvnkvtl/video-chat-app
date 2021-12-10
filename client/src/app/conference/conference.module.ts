import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomComponent } from './room/room.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {ConferenceRoutingModule} from "./conference-routing.module";
import {SocketService} from "../services/socket.service";
import { RoomsComponent } from './rooms/rooms.component';
import {MatCardModule} from "@angular/material/card";



@NgModule({
  declarations: [RoomComponent, RoomsComponent],
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ConferenceRoutingModule,
    MatCardModule,
  ],
  providers: [SocketService]
})
export class ConferenceModule { }
