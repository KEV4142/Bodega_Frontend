import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cuadro-consulta',
  imports: [],
  templateUrl: './cuadro-consulta.component.html',
  styles: ``
})
export class CuadroConsultaComponent {
  constructor(public dialogRef: MatDialogRef<CuadroConsultaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; text: string }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
