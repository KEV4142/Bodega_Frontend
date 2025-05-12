import { Component } from '@angular/core';
import { HeaderComponent } from '../../../componentes/header/header.component';
import { CommonModule } from '@angular/common';
import { ListadoGeneralComponent } from '../../../componentes/listado-general/listado-general.component';

@Component({
  selector: 'app-listadosalidas',
  imports: [
    ListadoGeneralComponent,
    CommonModule,
    HeaderComponent
  ],
  templateUrl: './listadosalidas.component.html',
  styles: ``,
})
export class ListadosalidasComponent {
  columnas = ['salidaID', 'fecha', 'cantidad','total','estado','usuarioRecibeNonmbre','fechaRecibido','acciones'];
  titulosColumnas = ['No. Salida', 'Fecha','Unidades Totales','Costo Total','Estado', 'Usuario','Fecha Recibida','Acciones'];

}
