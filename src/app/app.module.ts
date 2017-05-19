import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';

import {
  MdButtonModule,
  // MdCheckboxModule,
  // MdInputModule,
  MdListModule,
  MdProgressBarModule,
  // MdProgressSpinnerModule,
  // MdSelectModule,
  // MdTabsModule,
  MdToolbarModule,
  // MdSnackBarModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CountDownComponent } from './countdown.component';
import { CountDownService } from './countdown.service';
import { DashboardComponent } from './dashboard.component';
import { DataService } from './data.service';
import { HeroesComponent } from './heroes.component';
import { NavComponent } from './nav.component';
import { VillainsComponent } from './villains.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    AppRoutingModule,
    FormsModule,
    MdButtonModule,
    // MdCheckboxModule,
    // MdInputModule,
    MdListModule,
    // MdSelectModule,
    // MdProgressSpinnerModule,
    MdProgressBarModule,
    // MdSnackBarModule,
    // MdTabsModule,
    MdToolbarModule,
  ],
  declarations: [
    AppComponent,
    CountDownComponent,
    DashboardComponent,
    HeroesComponent,
    NavComponent,
    VillainsComponent,
  ],
  providers: [
    CountDownService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(requestOptions: RequestOptions) {
    requestOptions.headers.set('Content-Type', 'application/json');
  }
}
