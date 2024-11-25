import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required, 
        Validators.minLength(4)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(4)
      ]]
    });
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      try {
        const { username, password } = this.registerForm.value;
        const result = await this.authService.register(username, password);

        if (result.success) {
          await this.showAlert('Éxito', result.message);
          this.router.navigate(['/login']);
        } else {
          await this.showAlert('Error', result.message);
        }
      } catch (error) {
        console.error('Error en registro:', error);
        await this.showAlert('Error', 'Ocurrió un error durante el registro');
      } finally {
        this.isSubmitting = false;
      }
    }
  }

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Getters para facilitar el acceso a los controles del formulario en el template
  get usernameControl() {
    return this.registerForm.get('username');
  }

  get passwordControl() {
    return this.registerForm.get('password');
  }
}