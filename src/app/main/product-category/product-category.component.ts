import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeComponent } from '@circlon/angular-tree-component'
import { DataService } from '../../core/services/data.service'
import { NotificationService } from '../../core/services/notification.service'
import { UtilityService } from '../../core/services/utility.service'
import { MessageConstants } from '../../core/services/common/message.constant'
import { ModalDirective } from 'ngx-bootstrap/modal'


@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  @ViewChild('AddEditProductCategory', { static: false }) public ModalCategory: ModalDirective
  public treeCate: TreeComponent;
  public categories: any[];
  public parent_categories: any[];
  public child_categories: any[];
  public filter: string;
  public entity: any;

  constructor(private _dataSer: DataService, private notifiSer: NotificationService, private utilitySer: UtilityService) {
    this.entity = {};
  }
  ngOnInit(): void {
    this.loadCategory();
    this.GetAllCategory();
  }

  GetAllCategory() {
    this._dataSer.get('/api/productCategory/getallhierachy').subscribe((res: any[]) => {
      this.categories = res;
    }, err => {
      this._dataSer.handleError(err);
    })
  }

  GenerateAlias(name: string) {
    this.entity.Alias = this.utilitySer.MakeSeoTitle(name);
  }

  ShowProductCateModal() {
    this.ModalCategory.show();
  }

  loadCategory() {
    this._dataSer.get('/api/productCategory/getall?filter=' + this.filter).subscribe((res: any[]) => {
      this.parent_categories = res;
      this.child_categories = this.utilitySer.Unflatten2(res);
    }, err => {
      this._dataSer.handleError(err);
    })
  }

  GetCategoryDetail(id: any) {
    this._dataSer.get('/api/productCategory/detail/' + id).subscribe((res: any) => {
      this.ModalCategory.show();
      this.entity = res;
    }, err => {
      this._dataSer.handleError(err);
    })
  }

  DeleteCategory(id: any) {
    this.notifiSer.printConfirmDialog('Are you sure to delete this category', () => {
      this._dataSer.delete('/api/productCategory/delete', 'id', id).subscribe((res: any) => {
        this.notifiSer.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.loadCategory();
      }, err => {
        this._dataSer.handleError(err);
      })
    });
  }

  SaveChange(valid: boolean) {
    if (valid) {
      if (this.entity.ID == undefined) {
        this._dataSer.post('/api/productCategory/add', this.entity).subscribe((res: any) => {
          this.ModalCategory.hide();
          this.notifiSer.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadCategory();
        }, err => {
          this._dataSer.handleError(err);
        })
      } else {
        this._dataSer.put('/api/productCategory/update', this.entity).subscribe((res: any) => {
          this.ModalCategory.hide();
          this.notifiSer.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
          this.loadCategory();
        })
      }
    }
  }

}
