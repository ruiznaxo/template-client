import { Pipe, PipeTransform } from '@angular/core';
import { Alimentacion } from './alimentar';

@Pipe({
  name: 'alimentacionFilterbyLinea',
  pure: false
})
export class AlimentacionFilterbyLineaPipe implements PipeTransform {

  transform(alimentacion: Alimentacion[], idLinea: number): any {    
    if (!alimentacion || !idLinea) {
        return alimentacion;
    }
    // filtra el array de Jaulas de acuerdo con una id de Linea, retorna un nuevo array
    return alimentacion.filter(item => item.IDLINEA === idLinea);
  }

}
