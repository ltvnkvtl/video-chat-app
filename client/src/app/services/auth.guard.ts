import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Observable, of} from "rxjs";
import {TokenStorageService} from "./token-storage.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private tokenService: TokenStorageService,
              private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.tokenService.getToken()) {
      return of(true)
    } else {
      this.router.navigate(['/login'], {
        queryParams: {
          returnUrl: '/conference'
        }
      })
      return of(false)
    }
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(childRoute, state);
  }

}
