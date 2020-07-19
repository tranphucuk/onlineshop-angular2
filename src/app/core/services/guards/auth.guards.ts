import { Injectable } from '@angular/core'
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router'
import { systemConstants } from '../common/system.constant'
import { urlConstants } from '../common/url.constant';

@Injectable()
export class AuthGuards implements CanActivate {
    constructor(private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (localStorage.getItem(systemConstants.CURRENT_USER)) {
            return true;
        } else {
            this.router.navigate([urlConstants.LOGIN], {
                queryParams: {
                    returnUrl: state.url
                }
            });
        }
        return false;
    }

}