import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { systemConstants } from 'src/app/core/services/common/system.constant';
import { NotificationService } from '../../core/services/notification.service';
import { MessageConstants } from '../../core/services/common/message.constant';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public pageDisplay: number = 10;
  public filter: string = '';
  public totalRow: number;
  public roles: any[];
  public entity: any;

  @ViewChild('AddEditRole', { static: false }) roleModal: ModalDirective;
  constructor(private dataSer: DataService, private notifyServ: NotificationService) {
    this.entity = {};
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dataSer.get('/api/appRole/getlistpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&filter=' + this.filter + '').subscribe((res: any) => {
      console.log(res);
      this.roles = res.Items;
      this.pageIndex = res.PageIndex;
      this.totalRow = res.TotalRows;
      this.pageSize = 20;
    });
  }

  pageChanged(event: any) {
    this.pageIndex = event.page;
    this.loadData();
  }

  ShowRoleModal() {
    this.roleModal.show();
  }

  SaveChange(valid: boolean) {
    if (valid) {
      if (this.entity.Id == undefined || this.entity.Id == '') {
        this.dataSer.post('/api/appRole/add', JSON.stringify(this.entity)).subscribe((res: any) => {
          this.loadData();
          this.roleModal.hide();
          this.notifyServ.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        }, error => {
          this.dataSer.handleError(error);
        });
      } else {

      }
    }
  }
}
