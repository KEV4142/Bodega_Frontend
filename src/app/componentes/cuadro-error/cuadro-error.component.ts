import { Component,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cuadro-error',
  imports: [MatDialogModule],
  templateUrl: './cuadro-error.component.html',
})
export class CuadroErrorComponent {
  constructor(
    public dialogRef: MatDialogRef<CuadroErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {}
}
