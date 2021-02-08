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

  jaulaUrl: string;

  constructor(private http: HttpClient, public ws: WebsocketService) {
    this.jaulaUrl = environment.baseUrl  
  } 

  getJaulas(): Observable<Jaula[]>{
    return this.http.get<Jaula[]>(this.jaulaUrl + "jaula")
  }
  
  getLineas(): Observable<any>{
    return this.http.get(this.jaulaUrl + "linea")
  }
  
  getProgramaciones(): Observable<any>{
    return this.http.get(this.jaulaUrl + "programacion")
  }

  getAlimentaciones(): Observable<any>{
    return this.http.get(this.jaulaUrl + "alimentacion")
  }

  getDosificadores(): Observable<any>{
    return this.http.get(this.jaulaUrl + "dosificador")
  }

  getSilos(): Observable<any>{
    return this.http.get(this.jaulaUrl + "silo")
  }

  getAlarmas(): Observable<any>{
    return this.http.get(this.jaulaUrl + "alarma")
  }

  getTipoAlarmas(): Observable<any>{
    return this.http.get(this.jaulaUrl + "tipoalarma")
  }

  updateTasaJaula(idJaula: number, valorTasa: number){
    this.http.patch(this.jaulaUrl + "jaula/" + idJaula, {tasa: valorTasa})
  }

  updateEstadoLinea(idLinea: number, estado: number){
    return this.http.patch(this.jaulaUrl + "linea/" + idLinea, {estado: estado})
  }

  updateHzPausa(idLinea: number, hzPausa: number){
    return this.http.patch(this.jaulaUrl + "linea/hzpausa/" + idLinea, {hzPausa: hzPausa})
  }

  setJaulaHabilitada(idJaula, valor){      
    return this.http.patch(this.jaulaUrl + "jaula/habilitada/" + idJaula, {habilitada: valor})
  }

}
