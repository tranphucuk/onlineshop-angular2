import { NgModule } from '@angular/core';
import {Routes, RouterModule} from '@angular/router'
import { CommonModule } from '@angular/common';
import { ProductCategoryComponent } from './product-category.component';
import { TreeModule } from '@circlon/angular-tree-component';
import {FormsModule} from '@angular/forms'
import { ModalModule } from 'ngx-bootstrap/modal';

const productCategoryRoutes: Routes=[
  {path:'', redirectTo:'index', pathMatch:'full'},
  {path:'index', component:ProductCategoryComponent}
]

@NgModule({
  declarations: [ProductCategoryComponent],
  imports: [
    CommonModule,
    TreeModule,
    FormsModule,
    ModalModule,
    RouterModule.forChild(productCategoryRoutes)
  ]
})
export class ProductCategoryModule { }
