import { Routes, RouterModule } from '@angular/router'
import { BillComponent } from '../bill/bill.component'
import { AddBillComponent } from '../bill/add-bill/add-bill.component'
import { BillDetailComponent } from '../bill/bill-detail/bill-detail.component'

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: BillComponent },
    { path: 'add-new-bill', component: AddBillComponent },
    { path: 'bill-detail/:id', component: BillDetailComponent },
]

export const billRoutes = RouterModule.forChild(routes);