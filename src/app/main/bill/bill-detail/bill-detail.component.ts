import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs';
import { DataService } from '../../../core/services/data.service'
import { UtilityService } from '../../../core/services/utility.service'
import { NotificationService } from '../../../core/services/notification.service'
import { MessageConstants } from '../../../core/services/common/message.constant';
import { systemConstants } from 'src/app/core/services/common/system.constant';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.css']
})
export class BillDetailComponent implements OnInit, OnDestroy {

  private _id: any;
  private routeSub: Subscription;
  public _bill_entity: any = {};
  public _bill_detail_list: any[] = [];
  public _total_bill: any = 0; // Total bill need to pay

  constructor(private route: ActivatedRoute, private dataSer: DataService, private utilitySer: UtilityService, private notiSer: NotificationService) { }
  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((param: any) => {
      this._id = param['id'];
      this.GetBill(this._id);
      this.GetBillDetails(this._id);


    })
  }

  GetBill(id: any) {
    this.dataSer.get('/api/Order/detail/' + id).subscribe((res: any) => {
      this._bill_entity = res;
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  GetBillDetails(id: any) {
    this.dataSer.get('/api/Order/getalldetails/' + id).subscribe((res: any[]) => {
      this._bill_detail_list = res;
      this._bill_entity.OrderDetails = this._bill_detail_list;

      this._bill_detail_list.forEach((item, index) => {
        this._total_bill += item.Price * item.Quantity
      });
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  SaveChanges() {
    this.dataSer.put('/api/Order/updateStatus?orderId=' + this._id).subscribe((res: any) => {
      this.notiSer.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      this.utilitySer.navigate('/main/bill/index');
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  ExportExcel() {
    this.dataSer.get('/api/Order/exportExcel/' + this._id).subscribe((res: any) => {
      console.log(res);
      window.open(systemConstants.BASE_API + res.Message);
    }, err => {
      this.dataSer.handleError(err);
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
