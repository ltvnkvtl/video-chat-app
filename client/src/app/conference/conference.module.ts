import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConferenceComponent } from './conference/conference.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import {ConferenceRoutingModule} from "./conference-routing.module";



@NgModule({
  declarations: [ConferenceComponent],
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ConferenceRoutingModule,
  ]
})
export class ConferenceModule { }
