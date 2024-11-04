import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service.service'; // Importa tu servicio de autenticación

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {
  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  login() {
    if (this.authService.login(this.username, this.password)) {
      this.authService.setUsername(this.username); // Set the username in the AuthService
      this.router.navigate(['/home']);
    } else {
      this.loginError = true;
    }
  }
}
