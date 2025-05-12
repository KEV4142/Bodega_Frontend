import { HttpParams } from "@angular/common/http";

export function construirQueryParams(obj: any): HttpParams{
    let queryParams = new HttpParams();

    for (let propiedad in obj){
        if (obj.hasOwnProperty(propiedad) && obj[propiedad] !== null && obj[propiedad] !== undefined && obj[propiedad] !== ''){
            let valor = obj[propiedad];
            if (valor instanceof Date) {
                valor = valor.toISOString().split('T')[0];
            }
            queryParams = queryParams.append(propiedad, valor);
        }
    }

    return queryParams;
}