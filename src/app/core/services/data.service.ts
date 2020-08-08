import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router'
import { systemConstants } from '../../core/services/common/system.constant';
import { AuthenService } from '../../core/services/authen.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/observable';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageConstants } from '../../core/services/common/message.constant';
import { urlConstants } from './common/url.constant';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private headers: Headers;
  constructor(private _http: Http, private _router: Router, private _authenService: AuthenService, private _notificationService: NotificationService,
    private _utilityService: UtilityService, private _messageConstant: MessageConstants) {

    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }

  get(uri: string) {
    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'Bearer ' + this._authenService.getLoggedInUser().access_token);
    return this._http.get(systemConstants.BASE_API + uri, { headers: this.headers }).pipe(map(this.extractData));
  }

  post(uri: string, data?: any) {
    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'Bearer ' + this._authenService.getLoggedInUser().access_token);
    return this._http.post(systemConstants.BASE_API + uri, data, { headers: this.headers }).pipe(map(this.extractData));
  }

  put(uri: string, data?: any) {
    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'Bearer ' + this._authenService.getLoggedInUser().access_token);
    return this._http.put(systemConstants.BASE_API + uri, data, { headers: this.headers }).pipe(map(this.extractData));
  }

  delete(uri: string, key: string, id: string) {
    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'Bearer ' + this._authenService.getLoggedInUser().access_token);
    return this._http.delete(systemConstants.BASE_API + uri + '/?' + key + '=' + id, { headers: this.headers }).pipe(map(this.extractData));;
  }


  deleteWithMultiParams(uri: string, params) {
    this.headers.delete('Authorization');

    this.headers.append("Authorization", "Bearer " + this._authenService.getLoggedInUser().access_token);
    var paramStr: string = '';
    for (let param in params) {
      paramStr += param + "=" + params[param] + '&';
    }
    return this._http.delete(systemConstants.BASE_API + uri + "/?" + paramStr, { headers: this.headers })
      .pipe(map(this.extractData));
  }

  postFile(uri: string, data?: any) {
    let newHeader = new Headers();
    newHeader.append('Authorization', 'Bearer ' + this._authenService.getLoggedInUser().access_token);
    return this._http.post(systemConstants.BASE_API + uri, data, { headers: newHeader }).pipe(map(this.extractData));
  }

  extractData(res: Response) {
    let body = res.json();
    return body || {};
  }

  public handleError(error: any) {
    if (error.status == 401) {
      localStorage.removeItem(systemConstants.CURRENT_USER);
      this._notificationService.printErrorMessage(MessageConstants.LOGIN_AGAIN_MESSAGE);
      this._utilityService.navigateToLogin();
    } else {
      let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${JSON.parse(error._body).Message}` : error.statusText;
      this._notificationService.printErrorMessage(errMsg);

      return Observable.throw(errMsg);
    }
  }
}
