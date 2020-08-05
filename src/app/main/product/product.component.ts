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
  public checkedList: any[];

  /*--------------------Product image variable-----------------------------*/
  public UploadImage: any;
  public productId: any;
  public productImgs: any[];
  @ViewChild('ProductImageManager', { static: false }) product_image_modal: ModalDirective;
  @ViewChild('path') selected_image;

  constructor(private dataSer: DataService,
    private notifySer: NotificationService,
    private utilitySer: UtilityService,
    private uploadSer: UploadService) { }

  /*--------------------Product quantity variable-----------------------------*/
  @ViewChild('ProductQuantityModal', { static: false }) product_quantity_modal: ModalDirective;
  public _product_Quantity_entity: any;
  public _product_Quantities: any[];
  public _size_List: any[];
  public _color_List: any[];
  public _sizeID: any = '';
  public _colorID: any = '';

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.GetProductCategoryList();
    this.LoadProducts();
    this.entity = {};
    this.UploadImage = {};
    this._product_Quantity_entity = {};
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

  DeleteMulti() {
    this.checkedList = [];
    for (let pr of this.products) {
      if (pr.checked)
        this.checkedList.push(pr.ID);
    }

    this.notifySer.printConfirmDialog('Are you sure to delete these products', () => {
      this.dataSer.delete('/api/product/deletemulti', 'checkedProducts', JSON.stringify(this.checkedList)).subscribe((res: any) => {
        this.notifySer.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.LoadProducts();
      }, erro => {
        this.dataSer.handleError(erro);
      })
    })
  }

  // Product Image part
  ShowImageManage(id: any) {
    this.product_image_modal.show();
    this.UploadImage.ProductId = id;

    this.LoadProductImgs(id);
  }

  LoadProductImgs(id: any) {
    this.dataSer.get('/api/productImage/getall?productId=' + id).subscribe((res: any[]) => {
      this.productImgs = res;
    }, err => {
      this.dataSer.handleError(err);
    })
  }


  SaveProductImage(valid: boolean) {
    if (valid) {
      let imgFile = this.selected_image.nativeElement
      if (imgFile.files.length > 0) {
        this.uploadSer.postWithFile('/api/upload/SaveImage', null, imgFile.files).then((url: any) => {
          this.UploadImage.Path = url;

          this.dataSer.post('/api/productImage/add', JSON.stringify(this.UploadImage)).subscribe((res: any) => {
            this.notifySer.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
            this.LoadProductImgs(this.UploadImage.ProductId);
          }, err => {
            this.dataSer.handleError(err);
          })
        })
      } else {

      }
    }
  }

  DeleteProductImg(id: any) {
    this.notifySer.printConfirmDialog('Delete this product image?', () => {
      this.dataSer.delete('/api/productImage/delete', 'id', id).subscribe((res: any) => {
        this.notifySer.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.LoadProductImgs(this.UploadImage.ProductId);
      }, err => {
        this.dataSer.handleError(err);
      })
    });
  }

  /*--------------Product Quantity Part---------------*/

  ShowQuantityManage(id: any) {
    this.product_quantity_modal.show();
    this._product_Quantity_entity.ProductId = id;
    this.GetSizeList();
    this.GetColorList();

    this.GetProductQuantityDetail(id);
  }

  GetProductQuantityDetail(id: any) {
    var url = '/api/productQuantity/getall?productId=' + id + '&sizeId=' + this._sizeID + '&colorId=' + this._colorID + '';
    this.dataSer.get(url).subscribe((res: any[]) => {
      this._product_Quantities = res;
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  SaveProductQuantity(sizeId: any, colorId: any) {
    this.dataSer.post('/api/productQuantity/add', this._product_Quantity_entity).subscribe((res: any) => {
      this.GetProductQuantityDetail(this._product_Quantity_entity.ProductId);
      this.notifySer.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
    }, error => {
      this.dataSer.handleError(error);
    })
  }

  DeleteQuantity(productID: any, sizeId: any, colorId: any) {
    this.notifySer.printConfirmDialog('Are you sure to delete this product quantity?', () => {
      var params = { productId: productID, sizeId: sizeId, colorid: colorId };
      this.dataSer.deleteWithMultiParams('/api/productQuantity/delete', params).subscribe((res: any) => {
        this.GetProductQuantityDetail(productID);
      }, erro => {
        this.dataSer.handleError(erro);
      })
    });
  }

  GetColorList() {
    this.dataSer.get('/api/productQuantity/getcolors').subscribe((res: any[]) => {
      this._color_List = res;
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  GetSizeList() {
    this.dataSer.get('/api/productQuantity/getsizes').subscribe((res: any[]) => {
      this._size_List = res;
    }, err => {
      this.dataSer.handleError(err);
    })
  }
}
