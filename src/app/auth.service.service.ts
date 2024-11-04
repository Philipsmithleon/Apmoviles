import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated: boolean = false;
  private username: string = '';
  authStatusChange: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isAuthenticated);
  private usernameSubject = new BehaviorSubject<string>('');
  public username$ = this.usernameSubject.asObservable();

  login(username: string, password: string): boolean {
    if (username.length >= 3 && username.length <= 8 && password.length === 4) {
      this.isAuthenticated = true;
      this.usernameSubject.next(username);
      // Opcional: Guardar en localStorage
      localStorage.setItem('username', username);
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    this.usernameSubject.next('');
    // Limpiar localStorage
    localStorage.removeItem('username');
  }

  setUsername(username: string): void {
    this.username = username;
  }

  getUsername(): string {
    return this.username;
  }

  setAuthStatus(status: boolean): void {
    this.isAuthenticated = status;
    this.authStatusChange.next(status);
  }

  checkAuthStatus(): boolean {
    return this.isAuthenticated;
  }
}