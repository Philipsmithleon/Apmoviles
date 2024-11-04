import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss']
})
export class PedidosPage {

  constructor(private navCtrl: NavController) { }

  volver() {
    this.navCtrl.back();
  }

}