import { Pipe, PipeTransform } from '@angular/core';
import { Alimentacion } from 'src/app/pages/alimentar/alimentar';

@Pipe({
  name: 'alimentacionFilterbyJaula',
  pure: false
})
export class AlimentacionFilterbyJaulaPipe implements PipeTransform {

  transform(alimentacion: Alimentacion[], jdJaula: number): any {    
    if (!alimentacion || !jdJaula) {
        return alimentacion;
    }
    // filtra el array de Jaulas de acuerdo con una id de Linea, retorna un nuevo array
    return alimentacion.filter(item => item.IDJAULA === jdJaula);
  }

}
