import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ProductosPage } from './productos.page';
import { ProductosPageRoutingModule } from './productos-routing.module';

// Material Imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ProductosPageRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatRippleModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  declarations: [ProductosPage]
})
export class productosPageModule {}
