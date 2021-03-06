import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebsocketService } from '../../core/services/websocket.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Jaula } from './alimentar';

@Injectable({
  providedIn: 'root'
})
export class AlimentarService {

  baseUrl: string;

  constructor(private http: HttpClient, public ws: WebsocketService) {
    this.baseUrl = environment.baseUrl  
  } 

  getJaulas(): Observable<Jaula[]>{
    return this.http.get<Jaula[]>(this.baseUrl + "jaula")
  }
  
  getLineas(): Observable<any>{
    return this.http.get(this.baseUrl + "linea")
  }
  
  getProgramaciones(): Observable<any>{
    return this.http.get(this.baseUrl + "programacion")
  }

  getAlimentaciones(): Observable<any>{
    return this.http.get(this.baseUrl + "alimentacion")
  }

  getDosificadores(): Observable<any>{
    return this.http.get(this.baseUrl + "dosificador")
  }

  getSilos(): Observable<any>{
    return this.http.get(this.baseUrl + "silo")
  }

  getAlarmas(): Observable<any>{
    return this.http.get(this.baseUrl + "alarma")
  }

  getTipoAlarmas(): Observable<any>{
    return this.http.get(this.baseUrl + "tipoalarma")
  }

  getSelectoras(): Observable<any>{
    return this.http.get(this.baseUrl + "selectora")
  }

  setParametros(idJaula: number, parametros: any){
    let body = {
      id: idJaula,
      parametros: parametros
    }
    return this.http.patch(this.baseUrl + "jaula/parametros/" + idJaula, body )
  }

  updateTasaJaula(idJaula: number, valorTasa: number){
    this.http.patch(this.baseUrl + "jaula/tasa" + idJaula, {tasa: valorTasa})
  }

  updateEstadoLinea(idLinea: number, estado: number){
    return this.http.patch(this.baseUrl + "linea/estado/" + idLinea, {estado: estado})
  }

  updateHzPausa(idLinea: number, hzPausa: number){
    return this.http.patch(this.baseUrl + "linea/hzpausa/" + idLinea, {hzPausa: hzPausa})
  }

  setJaulaHabilitada(idJaula, valor){      
    return this.http.patch(this.baseUrl + "jaula/habilitada/" + idJaula, {habilitada: valor})
  }

  getNombre(object: any[], id, property: string){
    return id ? object.find(o => o.ID === id)[property] : "Sin Asignar";    
  }

}
