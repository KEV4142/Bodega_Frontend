import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../../componentes/header/header.component';
import { Producto, ProductoRow, Sucursal } from '../salida-dto';
import { RouterLink } from '@angular/router';
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
import { SucursalService } from '../../../servicios/sucursal.service';
import { ProductoService } from '../../../servicios/producto.service';
import { LoteService } from '../../../servicios/lote.service';
import { SalidaService } from '../../../servicios/salida.service';

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
  productoSeleccionado: number | null = null;
  columnas: string[] = [
    'productoID',
    'descripcion',
    'cantidad',
    'loteID',
    'costo',
    'fechaVencimiento',
  ];

  constructor(
    private dialog: MatDialog,
    private sucursalService: SucursalService,
    private productoService: ProductoService  ,
    private loteService: LoteService,
    private salidaService: SalidaService) {}

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
    this.sucursalService.obtenerSucursalesActivas().subscribe((data: Sucursal[]) => {
    this.sucursales = data;
  });
  }
  loadProductos(): void {
    this.productoService.obtenerProductosActivos().subscribe((data: Producto[]) => {
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
    const productoID = this.form.value.productoid;
    const cantidad = this.form.value.cantidad;
    if (!productoID || !cantidad) return;

    this.loteService.obtenerLotesDisponibles(productoID, cantidad)
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
    const sucursalid = this.form.value.sucursalid;
    if (this.form.controls.sucursalid.invalid || this.productosTabla.length === 0 ) {
      return;
    }
    this.salidaService.registrarSalida(sucursalid!, this.productosTabla)
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
    /* this.form.setValue({
      sucursalid: null,
      productoid: null,
      cantidad: null
    }); */
    this.productosTabla = [];
    this.sumaTotal = 0;
    this.productoSeleccionado=null;
  }
  retirarProducto(): void {
    if(!this.productoSeleccionado){
      this.dialog.open(CuadroErrorComponent, {
        data: "No se tiene seleccionado algun producto en la tabla.",
      });
    }
    this.productosTabla = this.productosTabla.filter(
      (linea) => linea.loteID !== this.productoSeleccionado
    );
    this.sumaTotal = this.calcularTotal();
    this.productoSeleccionado=null;
  }
  seleccionarProducto(producto: ProductoRow) {
    this.productoSeleccionado = producto.loteID;
  }
}
