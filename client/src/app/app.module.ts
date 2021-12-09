import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import {HttpClientModule} from "@angular/common/http";
import {authInterceptorProviders} from "./services/auth.interceptor";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    HttpClientModule,
  ],
  providers: [
    authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
