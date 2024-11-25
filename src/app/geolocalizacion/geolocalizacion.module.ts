import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GeolocalizacionPageRoutingModule } from './geolocalizacion-routing.module';
import { GeolocalizacionPage } from './geolocalizacion.page';
import { PipesModule } from '../pipes/pipes.module';  // Importar el módulo de pipes

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GeolocalizacionPageRoutingModule,
    PipesModule  // Añadir el módulo de pipes
  ],
  declarations: [GeolocalizacionPage]
})
export class GeolocalizacionPageModule {}