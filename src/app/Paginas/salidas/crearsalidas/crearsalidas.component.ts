import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../componentes/header/header.component';
import { Producto, ProductoRow, SalidaResponse, Sucursal } from '../salida-dto';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CuadroErrorComponent } from '../../../componentes/cuadro-error/cuadro-error.component';
import { CuadroConfirmacionComponent } from '../../../componentes/cuadro-confirmacion/cuadro-confirmacion.component';

@Component({
  selector: 'app-crearsalidas',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HeaderComponent,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './crearsalidas.component.html',
  styles: ``,
})
export class CrearsalidasComponent implements OnInit {
  private formBuilder = inject(FormBuilder);

  sucursales: Sucursal[] = [];
  productos: Producto[] = [];
  productosTabla: ProductoRow[] = [];
  sumaTotal: number = 0;
  columnas: string[] = [
    'productoID',
    'descripcion',
    'cantidad',
    'loteID',
    'costo',
    'fechaVencimiento',
  ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  form = this.formBuilder.group({
    sucursalid: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    productoid: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
    cantidad: new FormControl<number | null>(null, {
      validators: [Validators.required, Validators.min(1)],
    }),
  });

  ngOnInit() {
    this.loadSucursales();
    this.loadProductos();
  }
  loadSucursales(): void {
    this.http
      .get<Sucursal[]>(`${environment.apiUrl}sucursales/activos`)
      .subscribe((data: Sucursal[]) => {
        this.sucursales = data;
      });
  }
  loadProductos(): void {
    this.http
      .get<Producto[]>(`${environment.apiUrl}productos/activos`)
      .subscribe((data: Producto[]) => {
        this.productos = data;
      });
  }
  obtenerErrorCampoSucursalID() {
    let campo = this.form.controls.sucursalid;
    if (campo.hasError('required')) {
      return 'El campo Sucursal es requerido';
    }
    if (campo.hasError('min')) {
      return 'El campo Sucursal debe estar seleccionado.';
    }
    return '';
  }
  obtenerErrorCampoProductoID() {
    let campo = this.form.controls.productoid;
    if (campo.hasError('required')) {
      return 'El campo Producto es requerido';
    }
    if (campo.hasError('min')) {
      return 'El campo Producto debe estar seleccionado.';
    }
    return '';
  }
  obtenerErrorCampoCantidad() {
    let campo = this.form.controls.cantidad;
    if (campo.hasError('required')) {
      return 'El campo Cantidad es requerido.';
    }
    if (campo.hasError('min')) {
      return 'El campo Cantidad debe ser mayor a 0.';
    }
    return '';
  }
  primeraLetraEnMayuscula(valor: any): string {
    if (!valor || typeof valor !== 'string') return valor;
    let resultado = valor.toLowerCase();
    return resultado.charAt(0).toUpperCase() + resultado.slice(1);
  }
  calcularTotal(): number {
    return this.productosTabla.reduce(
      (suma, linea) => suma + linea.cantidad * linea.costo,
      0
    );
  }
  agregarProducto(): void {
    this.http
      .post<ProductoRow[]>(`${environment.apiUrl}lotes/disponible`, {
        productoID: this.form.value.productoid,
        cantidad: this.form.value.cantidad,
      })
      .subscribe({
        next: (data: ProductoRow[]) => {
          const nuevos = data.filter(
            (nuevo) =>
              !this.productosTabla.some(
                (existente) =>
                  existente.productoID === nuevo.productoID &&
                  existente.loteID === nuevo.loteID
              )
          );

          if (nuevos.length === 0) {
            return;
          }

          this.productosTabla = [...this.productosTabla, ...nuevos];
          this.sumaTotal = this.calcularTotal();

          this.form.get('productoid')?.reset();
          this.form.get('cantidad')?.reset();
        },
        error: (err) => {
          if (err.error?.error) {
            this.dialog.open(CuadroErrorComponent, {
              data: err.error.error,
            });
          }
        },
      });
  }

  guardarCambios(): void {
    if (this.form.controls.sucursalid.invalid || this.productosTabla.length === 0 ) {
      return;
    }
    const salidaData = {
      sucursalid: this.form.value.sucursalid,
      salidasdetalle: this.productosTabla.map((linea) => ({
        loteid: linea.loteID,
        cantidad: linea.cantidad,
      })),
    };
    
    this.http
      .post<SalidaResponse>(environment.apiUrl + 'salidas/ingreso', salidaData)
      .subscribe({
        next: (response) => {
          this.dialog.open(CuadroConfirmacionComponent, {
            data: {
              mensaje: `Salida de Invetario No. ${response} fue registrada exitosamente.`,
            },
          });
          this.reiniciar();
        },
        error: (erro) => {
          if (erro.error?.error) {
            this.dialog.open(CuadroErrorComponent, {
              data: erro.error.error,
            });
          }
        },
      });
  }
  reiniciar(): void {
    this.form.reset();
    this.productosTabla = [];
    this.sumaTotal = 0;
  }
}
