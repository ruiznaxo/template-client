import { Pipe, PipeTransform } from '@angular/core';
import { Jaula } from 'src/app/pages/alimentar/alimentar';

@Pipe({
  name: 'jaulaFilterbyLinea',
  pure: false
})
export class JaulaFilterbyLineaPipe implements PipeTransform {

  transform(jaulas: Jaula[], idLinea: number): any {    
    if (!jaulas || !idLinea) {
        return jaulas;
    }
    // filtra el array de Jaulas de acuerdo con una id de Linea, retorna un nuevo array
    return jaulas.filter(item => item.IDLINEA === idLinea);
}

}
