import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'];
    const token = localStorage.getItem('token');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      const userRole = payload?.role;

      if (!userRole || !expectedRoles.includes(userRole)) {
        this.router.navigate(['/dashboard']); 
        return false;
      }

      return true;
    } catch (e) {
      console.error('Invalid Token:', e);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
