import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Programacion } from '../../alimentar/alimentar';

@Injectable({
  providedIn: 'root'
})
export class ProgramacionService {
  
  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl  
  } 

  getProgramaciones(): Observable<any>{
    return this.http.get(this.baseUrl + "programacion")
  }

  addProgramacion(programacion: Programacion) {
    return this.http.post(this.baseUrl + "programacion", {programacion})
  }

  updateEstadoLinea(idProgramacion: number, programacion: any){
    return this.http.patch(this.baseUrl + "programacion/" + idProgramacion, {programacion: programacion})
  }

  deleteProgrmacion(idProgramacion: number){
    return this.http.delete(this.baseUrl + "programacion/" + idProgramacion)
  }


}
