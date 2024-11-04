import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  animations: [
    trigger('slideAnimation', [
      state('inicial', style({ transform: 'translateX(0)' })),
      state('final', style({ transform: 'translateX(100px)' })),
      transition('inicial => final', animate('1s')),
      transition('final => inicial', animate('0s'))
    ])
  ]
})
export class PerfilPage {
  perfilForm: FormGroup;
  animationStateNombre: string = 'inicial';
  animationStateApellido: string = 'inicial';
  nivelesEducacion = ['Primaria', 'Secundaria', 'Técnico', 'Universitario', 'Postgrado'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private alertController: AlertController,
    private appComponent: AppComponent,
    private navCtrl: NavController
  ) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      nivelEducacion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required]
    });
  }

  mostrarDatos() {
    if (this.perfilForm.valid) {
      const { nombre, apellido, nivelEducacion, fechaNacimiento } = this.perfilForm.value;
      this.appComponent.actualizarPerfil(nombre, apellido, nivelEducacion, fechaNacimiento);

      this.alertController.create({
        header: 'Información del Perfil',
        message: `Nombre: ${nombre}<br>Apellido: ${apellido}<br>Nivel de Educación: ${nivelEducacion}<br>Fecha de Nacimiento: ${fechaNacimiento}`,
        buttons: ['OK']
      }).then(alert => alert.present());
    } else {
      this.alertController.create({
        header: 'Error de Validación',
        message: 'Por favor, complete todos los campos requeridos.',
        buttons: ['OK']
      }).then(alert => alert.present());
    }
  }
  volver() {
    this.navCtrl.back();
  }
  limpiarCampos() {
    this.perfilForm.reset();
    this.animationStateNombre = 'final';
    this.animationStateApellido = 'final';

    setTimeout(() => {
      this.animationStateNombre = 'inicial';
      this.animationStateApellido = 'inicial';
    }, 1000);
  }
}
