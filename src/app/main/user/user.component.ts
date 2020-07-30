import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service'
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';
import { throwError } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { MessageConstants } from '../../core/services/common/message.constant';
import { UtilityService } from '../../core/services/utility.service';
import { AuthenService } from '../../core/services/authen.service'

declare var moment: any;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  public users: any[];
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public filter: string = '';
  public entity: any;
  public roles: any[];
  public allRoles: IMultiSelectOption[] = [];
  public myRoles: IMultiSelectOption[];
  public dob: any;

  @ViewChild('AddEditUser', { static: false }) userModal: ModalDirective;
  @ViewChild('avatar') avatar;
  constructor(private dataSer: DataService, private notifySer: NotificationService, public authenSer: AuthenService,
    private uploadSer: UploadService, private utilitySer: UtilityService) {
    if (this.authenSer.CanAccess('USER') == false) {
      this.utilitySer.navigateToLogin();
    }

  }

  public dateOptions: any = {
    locale: { format: 'YYYY-MM-DD' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  ngOnInit(): void {
    this.loadData();
    this.loadRoles();
    console.log(this.dateOptions);
  }

  loadData() {
    this.dataSer.get('/api/appUser/getlistpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&filter=' + this.filter + '').subscribe((res: any) => {
      this.users = res.Items;
    });
  }

  loadRoles() {
    this.dataSer.get('/api/appRole/getlistall').subscribe((res: any) => {
      for (let role of res) {
        this.allRoles.push({ id: role.Name, name: role.Description });
      }
    }, error => {
      return throwError(error);
    });
  }

  public selectGender(event) {
    this.entity.Gender = event.target.value
  }

  GetUserDetail(id: any) {
    this.dataSer.get('/api/appUser/detail/' + id).subscribe((res: any) => {
      this.userModal.show();
      this.entity = res;
      this.myRoles = [];
      for (let role of this.entity.Roles) {
        this.myRoles.push(role);
      }
      this.entity.BirthDay = moment(new Date(this.entity.BirthDay)).format('DD/MM/YYYY');

    }, error => {
      this.dataSer.handleError(error);
    })
  }

  onChange(event: any) {
    this.myRoles = [];
    for (let role of event) {
      this.myRoles.push(role);
    }
  }

  selectedDate(event: any, picker: any) {
    this.dob = new Date(event.start._d).toDateString();
  }

  SaveData() {
    this.entity.Roles = this.myRoles;
    this.entity.BirthDay = moment(new Date(this.dob)).format('DD/MM/YYYY');
    if (this.entity.Id == undefined || this.entity.Id == '') {
      this.dataSer.post('/api/appUser/add', this.entity).subscribe((res: any) => {
        this.userModal.hide();
        this.notifySer.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        this.loadData();
      }, error => {
        this.dataSer.handleError(error);
      });
    } else {
      // this.entity.Roles = this.myRoles;
      this.dataSer.put('/api/appUser/update', this.entity).subscribe((res: any) => {
        this.userModal.hide();
        this.notifySer.printSuccessMessage(MessageConstants.UPDATED_OK_MSG);
        this.loadData();
      }, error => {
        this.dataSer.handleError(error);
      });
    }
  }

  SaveChange(valid: boolean) {
    if (valid) {
      let fi = this.avatar.nativeElement;
      if (fi.files.length > 0) {
        this.uploadSer.postWithFile('/api/upload/SaveImage', null, fi.files).then((imgUrl: string) => {
          this.entity.Avatar = imgUrl;
        }).then(() => {
          this.SaveData();
        });
      } else {
        this.SaveData();
      }
    }
  }

  ShowModalUser() {
    this.entity = {};
    this.userModal.show();
  }
}
