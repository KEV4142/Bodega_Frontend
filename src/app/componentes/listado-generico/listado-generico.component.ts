import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-listado-generico',
  imports: [MatProgressSpinnerModule],
  templateUrl: './listado-generico.component.html',
  styles: ``
})
export class ListadoGenericoComponent {
  @Input({ required: true })
  listado: any;
}
