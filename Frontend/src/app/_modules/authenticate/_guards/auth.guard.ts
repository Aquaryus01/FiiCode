import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SettingsService } from '../../../_services/settings.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router,
              private settings: SettingsService){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      if(!this.settings.getToken())
        return true;

      this.router.navigate(['/']);
      return false;
  }
}

