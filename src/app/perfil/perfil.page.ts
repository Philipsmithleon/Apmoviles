import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService, UserProfile } from '../auth.service.service'; // Añadido UserProfile
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss']
})
export class PerfilPage implements OnInit {
  perfilForm: FormGroup;
  nivelesEducacion = ['Primaria', 'Secundaria', 'Técnico', 'Universitario', 'Postgrado'];
  currentUsername: string = '';
  perfilExistente: boolean = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      nivelEducacion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  async ngOnInit() {
    // Verificar si hay una sesión activa
    if (this.authService.isLoggedIn()) {
      this.currentUsername = this.authService.getCurrentUsername();
      await this.cargarPerfil();
    } else {
      this.router.navigate(['/login']);
    }

    // Suscribirse a cambios en el username
    this.authService.username$.subscribe(async username => {
      if (username) {
        this.currentUsername = username;
        await this.cargarPerfil();
      }
    });
  }

  async cargarPerfil() {
    if (!this.currentUsername) return;

    const loading = await this.loadingController.create({
      message: 'Cargando perfil...'
    });
    await loading.present();

    try {
      const profile = await this.authService.getProfile(this.currentUsername);
      if (profile) {
        this.perfilExistente = true;
        this.perfilForm.patchValue({
          nombre: profile.nombre,
          apellido: profile.apellido,
          nivelEducacion: profile.nivelEducacion,
          fechaNacimiento: profile.fechaNacimiento
        });
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      await this.mostrarAlerta('Error', 'No se pudo cargar el perfil');
    } finally {
      await loading.dismiss();
    }
  }

  async guardarPerfil() {
    if (this.perfilForm.valid && this.currentUsername) {
      const loading = await this.loadingController.create({
        message: 'Guardando perfil...'
      });
      await loading.present();

      try {
        const profileData: UserProfile = {
          username: this.currentUsername,
          ...this.perfilForm.value
        };

        const success = await this.authService.createProfile(profileData);
        
        if (success) {
          this.perfilExistente = true;
          await this.mostrarAlerta('Éxito', 'Perfil guardado correctamente');
        } else {
          await this.mostrarAlerta('Error', 'No se pudo guardar el perfil');
        }
      } catch (error) {
        console.error('Error al guardar:', error);
        await this.mostrarAlerta('Error', 'Error al guardar el perfil');
      } finally {
        await loading.dismiss();
      }
    }
  }

  async actualizarPerfil() {
    if (this.perfilForm.valid && this.currentUsername) {
      const loading = await this.loadingController.create({
        message: 'Actualizando perfil...'
      });
      await loading.present();

      try {
        const profileData: UserProfile = {
          username: this.currentUsername,
          ...this.perfilForm.value
        };

        const success = await this.authService.updateProfile(profileData);
        
        if (success) {
          await this.mostrarAlerta('Éxito', 'Perfil actualizado correctamente');
        } else {
          await this.mostrarAlerta('Error', 'No se pudo actualizar el perfil');
        }
      } catch (error) {
        console.error('Error al actualizar:', error);
        await this.mostrarAlerta('Error', 'Error al actualizar el perfil');
      } finally {
        await loading.dismiss();
      }
    }
  }

  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmar borrado',
      message: '¿Está seguro que desea borrar su perfil? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          role: 'destructive',
          handler: () => {
            this.borrarPerfil();
          }
        }
      ]
    });

    await alert.present();
  }

  async borrarPerfil() {
    if (!this.currentUsername) return;

    const loading = await this.loadingController.create({
      message: 'Borrando perfil...'
    });
    await loading.present();

    try {
      const success = await this.authService.deleteProfile(this.currentUsername);
      
      if (success) {
        this.perfilExistente = false;
        this.limpiarCampos();
        await this.mostrarAlerta('Éxito', 'Perfil borrado correctamente');
      } else {
        await this.mostrarAlerta('Error', 'No se pudo borrar el perfil');
      }
    } catch (error) {
      console.error('Error al borrar:', error);
      await this.mostrarAlerta('Error', 'Error al borrar el perfil');
    } finally {
      await loading.dismiss();
    }
  }

  limpiarCampos() {
    this.perfilForm.reset();
  }

  async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  volver() {
    this.navCtrl.back();
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}