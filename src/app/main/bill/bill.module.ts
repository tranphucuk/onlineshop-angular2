import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillComponent } from './bill.component';
import { billRoutes } from '../bill/bill.routes';
import { AddBillComponent } from './add-bill/add-bill.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { BillDetailComponent } from './bill-detail/bill-detail.component'
import { Daterangepicker } from 'ng2-daterangepicker';

@NgModule({
  declarations: [BillComponent, AddBillComponent, BillDetailComponent],
  imports: [
    CommonModule,
    billRoutes,
    ModalModule.forRoot(),
    Daterangepicker,
    FormsModule
  ]
})
export class BillModule { }
