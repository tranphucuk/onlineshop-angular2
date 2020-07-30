import { Component, OnInit } from '@angular/core';
import {AuthenService} from '../../../core/services/authen.service';
import {UtilityService}  from '../../../../app/core/services/utility.service';
import {LoggedinUser} from '../../../domain/loggedin.user'
import { systemConstants } from '../../../core/services/common/system.constant';

@Component({
  selector: 'app-topbar-menu',
  templateUrl: './topbar-menu.component.html',
  styleUrls: ['./topbar-menu.component.css']
})
export class TopbarMenuComponent implements OnInit {

  public _user: LoggedinUser;
  constructor(private utilityService: UtilityService, private authen: AuthenService) { }

  ngOnInit(): void {
    this._user = this.authen.getLoggedInUser();
  }

  logout(){
    localStorage.removeItem(systemConstants.CURRENT_USER);
    this.utilityService.navigateToLogin();
  }
}
