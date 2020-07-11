import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { systemConstants } from '../../core/services/common/system.constant';
import { map } from 'rxjs/operators';``
import { LoggedinUser } from '../../domain/loggedin.user';

@Injectable({
  providedIn: 'root'
})
export class AuthenService {

  constructor(private http: Http) { }

  login(username: string, password: string) {
    let body = 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password) + '&grant_type=password';
    let header = new Headers();
    header.append('Content-Type', 'application/x-www-form-urlencoded');
    let options = new RequestOptions({ headers: header });

    return this.http.post(systemConstants.BASE_API + '/api/oauth/tokenapi', body, options).pipe(map((response: Response) => {
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
      return true;
    } else {
      return false;
    }
  }

  getLoggedInUser(): LoggedinUser {
    let user: LoggedinUser;
    if (this.isAuthenticated()) {
      var userJson = JSON.parse(localStorage.getItem(systemConstants.CURRENT_USER));
       user = new LoggedinUser(userJson.access_token, userJson.username, userJson.fullName, userJson.email, userJson.avatar);
    } else {
      user = null;
    }
    return user;
  }
}
