import { Component, OnInit, ViewChild } from '@angular/core';
// import '~@circlon/angular-tree-component/css/angular-tree-component.css';
import { TreeComponent } from '@circlon/angular-tree-component'
import { DataService } from '../../core/services/data.service'
import { NotificationService } from '../../core/services/notification.service'
import { UtilityService } from '../../core/services/utility.service'
import { MessageConstants } from '../../core/services/common/message.constant'
import { ModalDirective } from 'ngx-bootstrap/modal'


@Component({
  selector: 'app-function',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.css']
})
export class FunctionComponent implements OnInit {

  private treeFunc: TreeComponent
  public _functionHierachy: any[];
  public _funcParrent: any[];
  public entity: any;
  public editFlag: boolean = false;
  public filter: string = '';
  public functions: any[];
  public permissions: any;
  public functionId : string;

  @ViewChild('FunctionModal', { static: false }) functionModal: ModalDirective
  @ViewChild('PermissionModal', { static: false }) PermissionModal: ModalDirective
  constructor(private _dataSer: DataService, private notifiSer: NotificationService, private utilitySer: UtilityService) { }
  ngOnInit(): void {
    this.entity = {};
    this.loadFunctions();
  }

  loadFunctions() {
    this._dataSer.get('/api/function/getall?filter=' + this.filter).subscribe((res: any[]) => {
      this._funcParrent = res.filter(x => x.ParentId == null);
      this._functionHierachy = this.utilitySer.Unflatten(res);
    }, error => {
      this._dataSer.handleError(error);
    });
  }

  AddNewFunc() {
    this.editFlag = false;
    this.functionModal.show();
  }

  GetFunctionDetails(id: string) {
    this._dataSer.get('/api/function/detail/' + id).subscribe((res: any) => {
      this.entity = res;
      this.editFlag = true;
      this.functionModal.show();
    })
  }

  DeleteFunction(id: any) {
    this.notifiSer.printConfirmDialog(MessageConstants.DELETED_OK_MSG, () => {
      this._dataSer.delete('/api/function/delete', 'id', id).subscribe((res: any) => {
        this.notifiSer.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.loadFunctions();
      }, err => {
        this._dataSer.handleError(err);
      })
    })
  }

  SaveChange(valid: boolean) {
    if (valid) {
      if (this.editFlag == false) {
        this._dataSer.post('/api/function/add', this.entity).subscribe((res: any) => {
          this.functionModal.hide();
          this.notifiSer.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
          this.loadFunctions();
        }, error => {
          this._dataSer.handleError(error);
        })
      } else {
        this._dataSer.put('/api/function/update', this.entity).subscribe((res: any) => {
          this.functionModal.hide();
          this.notifiSer.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
          this.loadFunctions();
        }, err => {
          this._dataSer.handleError(err);
        })
      }
    }
  }

  ShowPermissionModal(id: any) {
    this.PermissionModal.show();
    this.GetPermission(id);
  }

  GetPermission(id: any) {
    this.functionId = id;
    this._dataSer.get('/api/appRole/getAllPermission?functionId=' + id).subscribe((res: any) => {
      this.permissions = res;
      console.log(res);
    }, err => {
      this._dataSer.handleError(err);
    });
  }

  SavePermission(permissions: any) {

    var data = {
      Permissions: this.permissions,
      FunctionId: this.functionId
    }

    this._dataSer.post('/api/appRole/savePermission', JSON.stringify(data)).subscribe((res: any) => {
      this.notifiSer.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
      this.PermissionModal.hide();
    }, err => {
      this._dataSer.handleError(err);
    })
  }
}
