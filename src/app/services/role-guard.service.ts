import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate  {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userDetails:any = localStorage.getItem('userInfo')
    const userInfo = JSON.parse(userDetails);
    if (userInfo && userInfo.accountType === expectedRole) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
