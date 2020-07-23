import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';


const userRoutes: Routes=[
  {path:'', redirectTo:'index', pathMatch:'full'},
  {path:'index', component:UserComponent}
]

@NgModule({
  declarations: [UserComponent],
  imports: [
    CommonModule,
    FormsModule,
    Daterangepicker,
    MultiselectDropdownModule,
    RouterModule.forChild(userRoutes),
    ModalModule.forRoot(),
  ]
})
export class UserModule { }
