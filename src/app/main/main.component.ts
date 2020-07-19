import { Component, OnInit } from '@angular/core';
import { systemConstants } from '../core/services/common/system.constant';
import {UtilityService}  from '../../app/core/services/utility.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private utilityService: UtilityService) { }

  ngOnInit(): void {
  }

  logout(){
    localStorage.removeItem(systemConstants.CURRENT_USER);
    this.utilityService.navigateToLogin();
  }
}
