import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import {ConferenceComponent} from "./conference/conference.component";
import {AuthGuard} from "../services/auth.guard";

const routes: Routes = [
  { path: '', component: ConferenceComponent, canActivate: [AuthGuard] },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ConferenceRoutingModule { }
