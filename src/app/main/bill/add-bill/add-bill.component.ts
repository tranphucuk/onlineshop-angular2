import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataService } from '../../../core/services/data.service'
import { UtilityService } from '../../../core/services/utility.service'
import { NotificationService } from '../../../core/services/notification.service'
@Component({
  selector: 'app-add-bill',
  templateUrl: './add-bill.component.html',
  styleUrls: ['./add-bill.component.css']
})

export class AddBillComponent implements OnInit {

  @ViewChild('ModalBillDetails', { static: false }) modal_bill_details: ModalDirective
  @ViewChild('paymentMethod') payment_method: ElementRef;

  /*Bill Details variable*/
  public productId: any;
  public Quantity: any;
  public Price: any;
  public ColorId: any;
  public SizeId: any;
  public OrderId: any;
  public _bill_detail_entity: any;
  public _bill_detail_list: any[];
  public _products: any[];
  public _colors: any[];
  public _sizes: any[];

  /*Bill variable*/
  public _bill_entity: any;

  constructor(private dataSer: DataService, private utilitySer: UtilityService, private notiSer: NotificationService) {
    this.GetProductList();
    this.GetColorList();
    this.GetSizeList();
    this._bill_detail_entity = {};
    this._bill_detail_list = [];
    this._bill_entity = {};
  }

  ngOnInit(): void {
  }

  AddBillDetails() {
    this.modal_bill_details.show();
  }

  GrabBillDetailsValue() {
    this._bill_detail_entity.Product = this._products.find(x => x.ID == this._bill_detail_entity.ProductId);
    this._bill_detail_entity.Total = this._bill_detail_entity.Price * this._bill_detail_entity.Quantity;

    var is_product_exist = this._bill_detail_list.find(x =>
      x.Product.Id == this._bill_detail_entity.ProductId
      && x.ColorId == this._bill_detail_entity.ColorId
      && x.SizeId == this._bill_detail_entity.SizeId);
    if (is_product_exist) {
      this._bill_detail_list.splice(this._bill_detail_list[this._bill_detail_entity], 1);
    }

    this._bill_detail_list.push(this._bill_detail_entity);
    this._bill_detail_entity = {};
    this.modal_bill_details.hide();
  }

  GetProductList() {
    this.dataSer.get('/api/product/getallparents').subscribe((res: any[]) => {
      this._products = res;
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  GetColorList() {
    this.dataSer.get('/api/productQuantity/getcolors').subscribe((res: any[]) => {
      this._colors = res;
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  GetSizeList() {
    this.dataSer.get('/api/productQuantity/getsizes').subscribe((res: any[]) => {
      this._sizes = res;
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  DeleteBillDetail(detail: any) {
    var index = this._bill_detail_list.findIndex(x =>
      x.Product.Id = detail.ProductId
      && x.ColorId == detail.ColorId
      && x.SizeId == detail.SizeId);
    if (index != -1) {
      this._bill_detail_list.splice(index, 1);
    }
  }

  SaveChanges() {
    this._bill_entity.OrderDetails = this._bill_detail_list;
    // console.log(this._bill_entity);
    this.dataSer.post('/api/Order/add', this._bill_entity).subscribe((res: any) => {
      this.notiSer.printSuccessMessage('Add new bill successfully');
      this.utilitySer.navigate('/main/bill/index');
    }, err => {
      this.dataSer.handleError(err);
    })
  }
}
