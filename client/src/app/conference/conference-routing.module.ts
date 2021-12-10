import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {RoomComponent} from "./room/room.component";
import {AuthGuard} from "../services/auth.guard";
import {RoomsComponent} from "./rooms/rooms.component";

const routes: Routes = [
  { path: '', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: ':id', component: RoomComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConferenceRoutingModule { }
