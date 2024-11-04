import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage implements OnInit {
  
  username: string | null = null; // Almacena el nombre de usuario

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

  constructor(private router: Router) {}

  ngOnInit() {
    // Obtener el nombre de usuario desde la navegación, si existe
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.username = navigation.extras.state['username'];
    }

    // Asignar el tiempo de delay para cada categoría
    this.categorias.forEach((categoria, index) => {
      categoria.animationDelay = `${index * 0.1}s`;
    });
  }
  
  verProductosPorCategoria(categoria: any) {
    this.router.navigate(['/productos', categoria.nombre]);
  }

  logout() {
    this.router.navigate(['/login']);
    // Implementar lógica de cierre de sesión
  }
}
