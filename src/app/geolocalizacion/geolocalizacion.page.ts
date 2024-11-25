import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-geolocalizacion',
  templateUrl: './geolocalizacion.page.html',
  styleUrls: ['./geolocalizacion.page.scss'],
})
export class GeolocalizacionPage implements OnInit {
  coordinates?: { latitude: number; longitude: number };
  mapUrl?: string;

  async getCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
      
      // Crear URL para Google Maps
      this.mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyA9A2_aqi-nKLJUG1CjNNhUtQoUDYtJNS0&q=${this.coordinates.latitude},${this.coordinates.longitude}`;
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  ngOnInit() {
    // Solicitar permisos al iniciar
    this.requestPermissions();
  }

  async requestPermissions() {
    try {
      await Geolocation.requestPermissions();
    } catch (error) {
      console.error('Error al solicitar permisos:', error);
    }
  }
}