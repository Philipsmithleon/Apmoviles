import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth.service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.authStatusChange.subscribe((status) => {
      this.isAuthenticated = status;
    });
  }

  canActivate(): boolean {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}