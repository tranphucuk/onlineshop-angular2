import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DataService } from '../../core/services/data.service'
import { NotificationService } from '../../core/services/notification.service';
import { MessageConstants } from '../../core/services/common/message.constant';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

  @ViewChild('AddAnnouncementModal', { static: false }) AnnModal: ModalDirective
  /*Global variable*/
  public _announcement: any;
  public _announcement_list: any[];
  public _page: number = 1;
  public _pageSize: number = 20;

  constructor(private dataSer: DataService, private notifyServ: NotificationService) {
    this._announcement = {};
    this._announcement_list = [];
    this.LoadData();
  }

  ngOnInit(): void { }

  LoadData() {
    this.dataSer.get('/api/Announcement/getall?pageIndex=' + this._page + '&pageSize=' + this._pageSize + '').subscribe((res: any) => {
      this._announcement_list = res.Items;
    }, err => {
      this.dataSer.handleError(err);
    })
  }

  ShowAnnModal() {
    this.AnnModal.show();
  }

  SaveChanges(valid: boolean) {
    if (valid) {
      this.dataSer.post('/api/Announcement/add', this._announcement).subscribe((res: any) => {
        this.notifyServ.printSuccessMessage(MessageConstants.CREATED_OK_MSG);
        this.AnnModal.hide();
        this.LoadData();
      }, err => {
        this.dataSer.handleError(err);
      })
    }
  }

  DeleteAnn(id: any) {
    this.notifyServ.printConfirmDialog('Are you sure to delete this Announcement?', () => {
      this.dataSer.delete('/api/Announcement/delete', 'id', id).subscribe((res: any) => {
        this.notifyServ.printSuccessMessage(MessageConstants.DELETED_OK_MSG);
        this.LoadData();
      }, err => {
        this.dataSer.handleError(err);
      })
    })
  }
}
