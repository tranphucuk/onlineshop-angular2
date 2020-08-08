import { Component, OnInit } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { DataService } from '../../core/services/data.service'
import { UtilityService } from '../../core/services/utility.service'
declare var moment: any;

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.css']
})
export class BillComponent implements OnInit {

  /*Bill variable*/
  public _bill_list: any;
  public _startDate: any = '';
  public _endDate: any = '';
  public _customerName: any = '';
  public _paymentStatus: any = '';
  public _page: any = 1;
  public _pageSize: any = 20;
  public _filter: any = '';
  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  constructor(private dataSer: DataService, private route: Router, private utilitySer: UtilityService) { }

  ngOnInit(): void {
    this.LoadBills();
  }

  LoadBills() {
    var url = '/api/Order/getlistpaging?startDate=' +
      this._startDate + '&endDate=' +
      this._endDate + '&customerName=' +
      this._customerName + '&paymentStatus=' +
      this._paymentStatus + '&page=' + this._page + '&pageSize=' + this._pageSize + '&filter=' + this._filter + '';

    this.dataSer.get(url).subscribe((res: any) => {
      this._bill_list = res.Items;
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  SearchEnter(event: any) {
    if (event.keyCode == 13) {
      this.LoadBills();
    }
  }

  ChangeStartDate(e: any) {
    this._startDate = moment(new Date(e.end._d)).format('DD/MM/YYYY');
  }

  ChangeEndDate(e: any) {
    this._endDate = moment(new Date(e.end._d)).format('DD/MM/YYYY');
  }

  ResetSearch() {
    this._customerName = '';
    this._endDate = '';
    this._startDate = '';
    this._paymentStatus = '';
    this.LoadBills();
  }
}
