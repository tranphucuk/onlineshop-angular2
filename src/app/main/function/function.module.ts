import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionComponent } from './function.component';
import { Routes, RouterModule } from '@angular/router';
import { TreeModule } from '@circlon/angular-tree-component';
import {FormsModule} from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal';

const functionRoutes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: FunctionComponent }
]

@NgModule({
  declarations: [FunctionComponent],
  imports: [
    CommonModule,
    TreeModule,
    FormsModule,
    RouterModule.forChild(functionRoutes),
    ModalModule.forRoot()
  ]
})
export class FunctionModule { }
