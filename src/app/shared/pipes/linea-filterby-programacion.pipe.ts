import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lineaFilterbyProgramacion'
})
export class LineaFilterbyProgramacionPipe implements PipeTransform {

  transform(lineas: any[], idProgramacion: number): any {
    if (!lineas) {
      return lineas;
    }
    return lineas.filter(item => item.IDPROGRAMACION === idProgramacion);
  }

}
