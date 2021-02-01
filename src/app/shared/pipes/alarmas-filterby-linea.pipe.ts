import { Pipe, PipeTransform } from '@angular/core';
import { Alarma } from '../../pages/alimentar/alimentar';

@Pipe({
  name: 'alarmaFilterbyLinea',
  pure: false
})
export class AlarmaFilterbyLineaPipe implements PipeTransform {

  transform(alimentacion: Alarma[], idLinea: number): any {    
    if (!alimentacion || !idLinea) {
        return alimentacion;
    }
    // filtra el array de Jaulas de acuerdo con una id de Linea, retorna un nuevo array
    return alimentacion.filter(item => item.IDLINEA === idLinea).filter(item => item.ESTADO === 1);
  }

}
