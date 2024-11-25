import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './auth.service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  username: string = '';
  cartItemCount: number = 0;
  showHeader: boolean = false;
  showBackButton: boolean = false;

  nombre: string = '';
  apellido: string = '';
  nivelEducacion: string = '';
  fechaNacimiento: string = '';

  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.username$.subscribe(username => {
      this.username = username;
    });
    const savedUsername = this.authService.getCurrentUsername();
    if (savedUsername) {
      this.username = savedUsername;
    }
    this.initializeApp();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        this.showHeader = currentUrl.includes('/productos') || currentUrl.includes('/home');
        this.showBackButton = currentUrl.includes('/productos');
      }
    });
  }

  private initializeApp() {
    this.loadCartItemCount();
  }

  private loadCartItemCount() {
    this.cartItemCount = 0;
  }

  goBack() {
    this.location.back();
  }

  gotoPerfil(){
    this.router.navigate(['/perfil']);
  }

  gotoCam(){
    this.router.navigate(['/camara']);
  }

  gotoGeo(){
    this.router.navigate(['/geolocalizacion']);
  }

  gotoPedidos(){
    this.router.navigate(['/pedidos']);
  }

  logout() {
    this.username = '';
    this.nombre = '';
    this.apellido = '';
    this.nivelEducacion = '';
    this.fechaNacimiento = '';
    this.router.navigate(['/login']);
  }

  actualizarPerfil(nombre: string, apellido: string, nivelEducacion: string, fechaNacimiento: string) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.nivelEducacion = nivelEducacion;
    this.fechaNacimiento = fechaNacimiento;
  }
}
