import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router';
import { AuthenService } from '../core/services/authen.service';
import { NotificationService } from '../core/services/notification.service';
import { HttpModule } from '@angular/http';

export const routes: Routes = [
  { path: '', component: LoginComponent },

]


@NgModule({
  declarations: [LoginComponent],
  providers: [AuthenService, NotificationService],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule ,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
