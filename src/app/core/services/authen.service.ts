import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { systemConstants } from '../../core/services/common/system.constant';
import { map } from 'rxjs/operators'; ``
import { LoggedinUser } from '../../domain/loggedin.user';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  constructor(private http: Http) { }

  login(username: string, password: string) {
    let body = 'userName=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password) + '&grant_type=password';
    let header = new Headers();
    header.append("Content-Type", "application/x-www-form-urlencoded");
    let options = new RequestOptions({ headers: header });

    return this.http.post(systemConstants.BASE_API + '/api/oauth/token', body, options).pipe(map((response: Response) => {
      let user: LoggedinUser = response.json();
      if (user.access_token && user) {
        localStorage.removeItem(systemConstants.CURRENT_USER);
        localStorage.setItem(systemConstants.CURRENT_USER, JSON.stringify(user));
      }
    }));
  }

  logout() {
    localStorage.removeItem(systemConstants.CURRENT_USER);
  }

  isAuthenticated(): boolean {
    let user = localStorage.getItem(systemConstants.CURRENT_USER);
    if (user == null) {
      return false;
    } else {
      return true;
    }
  }

  getLoggedInUser(): LoggedinUser {
    let user: LoggedinUser;
    if (this.isAuthenticated()) {
      var userJson = JSON.parse(localStorage.getItem(systemConstants.CURRENT_USER));
      user = new LoggedinUser(userJson.access_token, userJson.username,
        userJson.fullName,
        userJson.email,
        userJson.avatar,
        userJson.roles,
        userJson.permissions);
    } else {
      user = null;
    }
    return user;
  }

  CanAccess(functionId: string) {
    var user = this.getLoggedInUser();
    var result: boolean = false;
    var permissions: any[] = JSON.parse(user.permission);
    var roles: any[] = JSON.parse(user.roles);
    var hasPermissions: number = permissions.findIndex(x => x.FunctionId == functionId && x.CanRead == true);
    if (hasPermissions != -1 || roles.findIndex(x => x == 'Admin') != -1)
      return true;
    else
      return false;
  }

  CheckPermission(functionID: string, action: string): boolean {
    var user = this.getLoggedInUser();
    var permission: any[] = JSON.parse(user.permission);
    var roles: any[] = JSON.parse(user.roles);
    switch (action) {
      case 'create':
        var hasPermission: number = permission.findIndex(x => x.FunctionId = functionID && x.CanCreate == true)
        if (hasPermission != -1 || roles.findIndex(x => x == 'Admin') != -1)
          return true;
        else
          return false;

      case 'update':
        var hasPermission: number = permission.findIndex(x => x.FunctionId = functionID && x.CanUpdate == true)
        if (hasPermission != -1 || roles.findIndex(x => x == 'Admin') != -1)
          return true;
        else
          return false;

      case 'delete':
        var hasPermission: number = permission.findIndex(x => x.FunctionId = functionID && x.CanDelete == true)
        if (hasPermission != -1 || roles.findIndex(x => x == 'Admin') != -1)
          return true;
        else
          return false;
      default:
        break;
    }
  }
}
