import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import {Routes, RouterModule} from '@angular/router';
const userRoutes: Routes=[
  {path:'', redirectTo:'index', pathMatch:'full'},
  {path:'index', component:UserComponent}
]

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes)
  ]
})
export class UserModule { }
