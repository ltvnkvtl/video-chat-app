import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthRoutingModule} from "./auth-routing.module";
import {LoginComponent} from './login/login.component';
import {MatCardModule} from "@angular/material/card";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LoginComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class AuthModule {
}
