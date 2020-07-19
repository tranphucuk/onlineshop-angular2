import { Component, OnInit } from '@angular/core';
import { systemConstants } from '../core/services/common/system.constant';
import {UtilityService}  from '../../app/core/services/utility.service';
import {AuthenService} from '../core/services/authen.service';
import {LoggedinUser} from '../domain/loggedin.user'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
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
