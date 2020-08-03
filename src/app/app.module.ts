import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './app.routes'
import{AuthGuards} from './core/services/guards/auth.guards';


@NgModule({
  declarations: [
    AppComponent
    // MainComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [AuthGuards],
  bootstrap: [AppComponent]
})
export class AppModule { }
