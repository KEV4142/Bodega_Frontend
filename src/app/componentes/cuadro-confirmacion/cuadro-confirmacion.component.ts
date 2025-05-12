import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cuadro-confirmacion',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './cuadro-confirmacion.component.html',
  styles: ``
})
export class CuadroConfirmacionComponent {
  constructor(
    public dialogRef: MatDialogRef<CuadroConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}
}
