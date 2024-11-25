import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;
  loginError: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }


  async ngOnInit() {
    try {
      console.log('LoginPage - Iniciando');
      const isReady = await this.authService.isDatabaseReady();
      console.log('Base de datos lista:', isReady);
      
      if (!isReady) {
        await this.showAlert('Aviso', 
          'El sistema está iniciando. Por favor espere unos segundos antes de intentar iniciar sesión.');
      }
      
      await this.checkExistingSession();
    } catch (error) {
      console.error('Error en ngOnInit:', error);
    }
  }
  
  async login() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Iniciando sesión...',
        duration: 10000 // máximo 10 segundos
      });
      await loading.present();
  
      try {
        const { username, password } = this.loginForm.value;
        const result = await this.authService.login(username, password);
        //add storage ->trae en home
        localStorage.setItem('currentUser',username);
        //-------------------
        if (result.success) {
          this.loginError = false;
          await this.router.navigate(['/home']);
        } else {
          this.loginError = true;
          await this.showAlert('Error', result.message);
        }
      } catch (error) {
        console.error('Error en login:', error);
        await this.showAlert('Error', 
          'Ocurrió un error al intentar iniciar sesión. Por favor intente nuevamente.');
      } finally {
        await loading.dismiss();
      }
    } else {
      await this.showAlert('Error', 'Por favor complete todos los campos correctamente');
    }
  }
  async checkExistingSession() {
    const hasSession = await this.authService.checkExistingSession();
    if (hasSession) {
      this.router.navigate(['/home']);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  Register() {
    this.router.navigate(['/register']);
  }
  goToRegister() {
    this.router.navigate(['/perfil']);
  }
}