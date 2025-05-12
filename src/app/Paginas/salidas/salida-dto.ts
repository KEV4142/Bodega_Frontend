export interface SalidaResponse {
  isSuccess: boolean;
  value: number;
  error: string | null;
}
export interface Sucursal {
  sucursalID: number;
  descripcion: string;
  direccion: string;
  estado: string;
}
export interface Producto {
  productoID: number;
  descripcion: string;
  estado: string;
} 
export interface ProductoRow {
  productoID: number;
  descripcion: string;
  cantidad: number;
  loteID: number;
  costo: number;
  fechaVencimiento: Date;
}
