import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ListadoGenericoComponent } from '../listado-generico/listado-generico.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { PaginacionDTO } from '../interfaces/modeloPaginacion/paginacion-dto';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { construirQueryParams } from '../../Funciones/construirQueryParams';
import { CuadroConsultaComponent } from '../cuadro-consulta/cuadro-consulta.component';
import { Sucursal } from '../../Paginas/salidas/salida-dto';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SucursalService } from '../../servicios/sucursal.service';
import { SalidaService } from '../../servicios/salida.service';

@Component({
  selector: 'app-listado-general',
  imports: [CommonModule, MatButtonModule, ListadoGenericoComponent, MatTableModule, MatPaginatorModule,MatProgressSpinnerModule,MatIconModule,MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatCheckboxModule
  ],
  templateUrl: './listado-general.component.html',
  styles: ``
})
export class ListadoGeneralComponent<TDTO> implements OnInit {
  private formBuilder = inject(FormBuilder);
  cargando: boolean = false;

  @Input({required: true})
  titulo!: string;

  @Input({required: true})
  rutaCrear!: string;

  @Input({required: true})
  rutaEditar!: string;

  @Input({required: true})
  rutaBackend!: string;

  @Input({required: true}) 
  columnasAMostrar!: string[];

  @Input({required: true}) 
  columnasTitulo!: string[];

  @Input({required: true})
  campoID!: string;

  paginacion: PaginacionDTO = { PageNumber: 1, PageSize: 5 };
  entidades!: TDTO[];
  cantidadTotalRegistros!: number;
  formFiltros = this.formBuilder.group({
    SucursalID: [''],
    FechaInicio: [null],
    FechaFinal: [null],
    OrderBy: [''],
    OrderAsc: [true],
  });

  sucursales: Sucursal[] = [];

  constructor(private dialog: MatDialog,private snackBar: MatSnackBar, private sucursalService: SucursalService, private salidaService: SalidaService) {}

  ngOnInit(): void {
    this.sucursalService.obtenerSucursalesActivas().subscribe((data: Sucursal[]) => {
            this.sucursales = data;
          });
    if (!this.rutaBackend) {
      console.error('rutaBackend es requerido y no está definido.');
      return;
    }
    this.cargarRegistros();
  }
  actualizarPaginacion(datos: PageEvent) {
    this.paginacion = { PageNumber: datos.pageIndex + 1, PageSize: datos.pageSize };
    this.cargarRegistros();
  }
  openConfirmDialog(id:number) {
    const dialogRef = this.dialog.open(CuadroConsultaComponent, {
      width: '400px',
      data: {
        title: 'Confirmación',
        text: '¿Deseas recibir este registro de Salida?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.editar(id);
      }
    });
  }
  editar(id: number) {
    this.cargando = true;
    this.salidaService.actualizarEstado<TDTO>(this.rutaBackend, id, 'r').subscribe(() => {
      this.cargando = false;
      this.snackBar.open('Actualizacion de Registro Exitoso.', 'Cerrar', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.cargarRegistros();
    })
  }
  primeraLetraEnMayuscula(valor: any): string{
    if (!valor || typeof valor !== 'string') return valor;
    let resultado=valor.toLowerCase();
    return resultado.charAt(0).toUpperCase() + resultado.slice(1);
  }
  obtenerTituloColumna(columna: string): string {
    const indiceArreglo = this.columnasAMostrar.indexOf(columna);
    return this.columnasTitulo[indiceArreglo] ?? this.primeraLetraEnMayuscula(columna);
  }
  
  cargarRegistros() {
    let queryParams = construirQueryParams(this.paginacion);
    this.salidaService.obtenerPaginado<TDTO>(this.rutaBackend, queryParams).subscribe((respuesta) => {
      this.entidades = respuesta.items;
      this.cantidadTotalRegistros = respuesta.totalCount;
    });
    
  }
  aplicarFiltros() {
    const filtros = {
      PageNumber: 1,
      PageSize: this.paginacion.PageSize,
      SucursalID: this.formFiltros.value.SucursalID,
      FechaInicio: this.formFiltros.value.FechaInicio,
      FechaFinal: this.formFiltros.value.FechaFinal,
      OrderBy: this.formFiltros.value.OrderBy,
      OrderAsc: this.formFiltros.value.OrderAsc
    };

    const queryParams = construirQueryParams(filtros);
 
    this.salidaService.obtenerPaginado<TDTO>(this.rutaBackend, queryParams)
      .subscribe(respuesta => {
        this.entidades = respuesta.items;
        this.cantidadTotalRegistros = respuesta.totalCount;
      });
  }

}
