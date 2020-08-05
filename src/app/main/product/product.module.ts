import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductComponent } from './product.component';
import { Routes, RouterModule } from '@angular/router'
import { TabsModule } from 'ngx-bootstrap/tabs';
import {FormsModule } from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal'
import { PaginationModule } from 'ngx-bootstrap/pagination';

const productRoute: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: ProductComponent }
]

@NgModule({
  declarations: [ProductComponent],
  imports: [
    CommonModule,
    FormsModule,
    PaginationModule,
    TabsModule.forRoot(),
    ModalModule,
    RouterModule.forChild(productRoute)
  ],
  providers: []
})
export class ProductModule { }
