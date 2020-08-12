import { Component, OnInit, NgZone } from '@angular/core';
import { AuthenService } from '../../../core/services/authen.service';
import { UtilityService } from '../../../../app/core/services/utility.service';
import { LoggedinUser } from '../../../domain/loggedin.user'
import { systemConstants } from '../../../core/services/common/system.constant';
import { DataService } from 'src/app/core/services/data.service';
import { SignalrService } from '../../../core/services/signalr.service'
declare var moment: any;

@Component({
  selector: 'app-topbar-menu',
  templateUrl: './topbar-menu.component.html',
  styleUrls: ['./topbar-menu.component.css']
})
export class TopbarMenuComponent implements OnInit {
  public _user: LoggedinUser;
  public _baseFolder: string = systemConstants.BASE_API;
  public canSendMessage: boolean;
  public announcement: any[];
  constructor(private _utilityService: UtilityService, private _authen: AuthenService, private _dataSer: DataService,
    private _ngZone: NgZone, private _signarService: SignalrService) {
    this.subscribeToEvents();
  }

  ngOnInit(): void {
    this._user = this._authen.getLoggedInUser();
  }

  private subscribeToEvents(): void {
    var self = this;
    self.announcement = [];

    //if connection exist, it can call method
    this._signarService.connectionEstablished.subscribe(() => {
      this.canSendMessage = true;
    })

    // final our service method calls when response received from server event and transfer response to some variable to be shown on the browser
    this._signarService.announcementReceived.subscribe((ann: any) => {
      this._ngZone.run(() => {
        ann.CreatedDate = moment(moment(ann.CreatedDate).format('YYYYMMDD'), 'YYYYMMDD').fromNow();
        self.announcement.push(ann);
      });
    });
  }

  markAsRead(id: number) {
    var body = { announ: id };
    this._dataSer.get('/api/Announcement/markAsRead?announId=' + id).subscribe((res: any) => {
      if (res) {
        this.loadAnnouncement();
      }
    });
  }

  loadAnnouncement() {
    this._dataSer.get('/api/Announcement/getTopMyAnnouncement').subscribe((res: any) => {
      this.announcement = [];
      for (let item of res) {
        item.CreatedDate = moment(moment().format('YYYYMMDD'), 'YYYYMMDD').fromNow();
        this.announcement.push(item);
      }
    })
  }

  logout() {
    localStorage.removeItem(systemConstants.CURRENT_USER);
    this._utilityService.navigateToLogin();
  }
}
