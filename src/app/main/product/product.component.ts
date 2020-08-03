import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter, Input, Output } from '@angular/core';
import { DataService } from '../../core/services/data.service'
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { MessageConstants } from '../../core/services/common/message.constant';
import { UtilityService } from '../../core/services/utility.service';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements AfterViewInit, OnInit {

  @ViewChild('AddEditProduct', { static: false }) add_edit_product: ModalDirective;
  @ViewChild('productImage') productImage;
  public products: any[];
  public categoryId: any;
  public keyword: any = '';
  public pageIndex: any = 1;
  public pageSize: any = 6;
  public totalRow: any;
  public entity: any;
  public categories: any[];

  constructor(private dataSer: DataService,
    private notifySer: NotificationService,
    private utilitySer: UtilityService,
    private uploadSer: UploadService) { }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.GetProductCategoryList();
    this.LoadProducts();
    this.entity = {};
  }

  showAddEditModal() {
    this.add_edit_product.show();
  }

  GetProductCategoryList() {
    this.dataSer.get('/api/productCategory/getallhierachy').subscribe((res: any) => {
      this.categories = res;
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  GenerateAlias(name: string) {
    this.entity.Alias = this.utilitySer.MakeSeoTitle(name);
  }

  LoadProducts() {
    this.dataSer.get('/api/product/getall?categoryId=' + this.categoryId + '&keyword=' + this.keyword + '&page=' + this.pageIndex + '&pageSize=' + this.pageSize + '')
      .subscribe((res: any) => {
        this.products = res.Items;
        this.pageIndex = res.PageIndex;
        this.totalRow = res.TotalRows;
      }, err => {
        this.dataSer.handleError(err);
      })
  }

  OnKeyup(event) {
    if (event.keyCode == 13) {
      this.LoadProducts();
    }
  }

  SearchProduct(keyword: any) {
    this.LoadProducts();
  }

  pageChanged(event: any) {
    this.pageIndex = event.page;
    this.LoadProducts();
  }

  onSelectChange(categoryId) {
    this.categoryId = categoryId;
    this.LoadProducts();
  }

  SaveData() {
    if (this.entity.ID == undefined) {
      this.dataSer.post('/api/product/add', JSON.stringify(this.entity)).subscribe((res: any) => {
        this.add_edit_product.hide();
        this.notifySer.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        this.LoadProducts();
      }, err => {
        this.dataSer.handleError(err);
      })
    } else {
      this.dataSer.put('/api/product/update', JSON.stringify(this.entity)).subscribe((res: any) => {
        this.add_edit_product.hide();
        this.notifySer.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        this.LoadProducts();
      })
    }
  }

  GetProductDetail(id: any) {
    this.dataSer.get('/api/product/detail/' + id).subscribe((res: any) => {
      this.entity = res;
      this.showAddEditModal();
    }, err => {
      this.dataSer.handleError(err);
    });
  }

  DeleteProduct(id: any) {
    this.notifySer.printConfirmDialog('Areu sure to delete this product', () => {
      this.dataSer.delete('/api/product/delete', 'id', id).subscribe((res: any) => {
        this.LoadProducts();
      }, error => {
        this.dataSer.handleError(error);
      })
    });
  }

  SaveChange(valid: boolean) {
    if (valid) {
      let fi = this.productImage.nativeElement;
      if (fi.files.length > 0) {
        this.uploadSer.postWithFile('/api/upload/SaveImage', null, fi.files).then((imgUrl: any) => {
          this.entity.ThumbnailImage = imgUrl;
        }).then(() => {
          this.SaveData();
        });
      } else {
        this.SaveData();
      }
    }
  }


}
