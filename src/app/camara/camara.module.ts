import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CamaraPageRoutingModule } from './camara-routing.module';
import { CamaraPage } from './camara.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    CamaraPageRoutingModule
  ],
  declarations: [CamaraPage]
})
export class CamaraPageModule {}