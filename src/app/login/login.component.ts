import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../core/services/notification.service';
import { AuthenService } from '../core/services/authen.service';
import { MessageConstants } from '../core/services/common/message.constant';
import { urlConstants } from '../core/services/common/url.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  model: any = {};
  returnUrl: string;
  constructor(private authenService: AuthenService,
    private notifyService: NotificationService,
    private router: Router) {

  }

  ngOnInit(): void {
  }

  login() {
    this.loading = true;
    this.authenService.login(this.model.username, this.model.password).subscribe(data => {
      this.router.navigate([urlConstants.HOME]);
    }, err => {
      this.notifyService.printErrorMessage(MessageConstants.SYSTEM_ERROR_MSG);
      this.loading = false;
    });
  }
}
