import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { Network } from '@capacitor/network';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  
  username: string | null = null; // Almacena el nombre de usuario
  ipAddress: string | null = null;
  isOnline: boolean = true;

  categorias = [
    {
      id: 1,
      nombre: 'pasteles',
      imagen: 'assets/pasteles.png',
      descripcion: 'Deliciosos pasteles para toda ocasión',
      animationDelay: '0s' // Propiedad para la animación
    },
    {
      id: 2,
      nombre: 'postres',
      imagen: 'assets/postres.jpg',
      descripcion: 'Postres artesanales únicos',
      animationDelay: '0s' 
    },
    {
      id: 3,
      nombre: 'especiales',
      imagen: 'assets/especiales.png',
      descripcion: 'Creaciones exclusivas y temporada',
      animationDelay: '0s'
    }
  ];

  constructor(private router: Router,
    private apiService: ApiService,
    private toastController: ToastController) {}

  async ngOnInit() {
    // Obtener el nombre de usuario desde la navegación, si existe
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      //this.username = navigation.extras.state['username'];
      this.username = localStorage.getItem('currentUser');
    }

    // Asignar el tiempo de delay para cada categoría
    this.categorias.forEach((categoria, index) => {
      categoria.animationDelay = `${index * 0.1}s`;
    });
    //-----------------obtiene ip---------------
    const networkStatus = await Network.getStatus();
    this.isOnline = networkStatus.connected;

    // Obtener IP
    this.fetchIpAddress();

    Network.addListener('networkStatusChange', status => {
      this.isOnline = status.connected;
      this.showNetworkStatusToast();
      
      if (status.connected) {
        this.fetchIpAddress();
      }
    });
  }
  fetchIpAddress() {
    this.apiService.getIpAddress().subscribe({
      next: (response) => {
        this.ipAddress = response.ip;
      },
      error: (error) => {
        console.error('Error obteniendo IP', error);
        this.ipAddress = 'No disponible';
      }
    });
  }

  async showNetworkStatusToast() {
    const toast = await this.toastController.create({
      message: this.isOnline 
        ? 'Conexión a internet restablecida' 
        : 'Sin conexión a internet. Mostrando IP almacenada',
      duration: 3000,
      color: this.isOnline ? 'success' : 'warning'
    });
    toast.present();
  }

  verProductosPorCategoria(categoria: any) {
    this.router.navigate(['/productos', categoria.nombre]);
  }

  logout() {
    this.router.navigate(['/login']);
    // Implementar lógica de cierre de sesión
  }
}
