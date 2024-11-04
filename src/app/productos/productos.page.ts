// productos.page.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss']
})
export class ProductosPage implements OnInit {
  categoria: string = '';
  productos: any[] = [];
  productosFiltrados: any[] = [];

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
  ) {
    // Intentar obtener datos extra del estado de navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as { categoria: any };
      console.log('Datos extra recibidos:', state);
    }
  }
  async agregarAlCarrito(event: Event, producto: any) {
    event.stopPropagation(); // Evita que se active el routerLink
    
    // Aquí iría la lógica real de agregar al carrito
    const toast = await this.toastController.create({
      message: `${producto.nombre} agregado al carrito`,
      duration: 2000,
      position: 'bottom',
      color: 'success',
      cssClass: 'toast-message'
    });
    toast.present();
  }
  ngOnInit() {
    // Cargar productos de ejemplo
    this.productos = [
      {
        id: 1,
        nombre: 'Pastel de Chocolate',
        descripcion: 'Delicioso pastel de chocolate con capas de crema belga',
        precio: 2500,
        imagen: 'assets/pastel-chocolate.png',
        categoria: 'pasteles',
        etiquetas: ['Más vendido', 'Recomendado']
      },
      {
        id: 2,
        nombre: 'Cheesecake',
        descripcion: 'Cheesecake cremoso con base de galleta y salsa de frutos rojos',
        precio: 2500,
        imagen: 'assets/cheesecake.jpg',
        categoria: 'postres',
        etiquetas: ['Nuevo']
      },
      {
        id: 3,
        nombre: 'Cupcakes de Fresa',
        descripcion: 'Mini pasteles decorados con crema de fresa natural',
        precio: 3000,
        imagen: 'assets/cupcakes-fresa.jpg',
        categoria: 'especiales',
        etiquetas: ['Especial del día']
      },
      {
        id: 4,
        nombre: 'Torta Red Velvet',
        descripcion: 'Torta red velvet con frosting de queso crema',
        precio: 4500,
        imagen: 'assets/red-velvet.png',
        categoria: 'pasteles',
        etiquetas: ['Más vendido']
      }
    ];
    // Suscribirse a los cambios de parámetros
    this.route.paramMap.subscribe(params => {
      this.categoria = params.get('categoria') || '';
      console.log('Categoría recibida:', this.categoria);
      this.filtrarProductos();
    });

    // Suscribirse a los cambios de URL
    this.route.url.subscribe(url => {
      console.log('URL actual:', url);
    });
  }
  volver() {
    this.navCtrl.back();
  }
  filtrarProductos() {
    console.log('Filtrando productos para categoría:', this.categoria);
    console.log('Total de productos:', this.productos.length);
    
    this.productosFiltrados = this.productos.filter(producto => 
      producto.categoria.toLowerCase() === this.categoria.toLowerCase()
    );
    
    console.log('Productos filtrados:', this.productosFiltrados);
  }
}