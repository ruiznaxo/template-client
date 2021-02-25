import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Jaula } from '../../alimentar/alimentar';

@Injectable({
  providedIn: 'root'
})
export class JaulaService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl  
  } 

  getJaulas(): Observable<any>{
    return this.http.get(this.baseUrl + "jaula")
  }

  addJaula(jaula: Jaula) {
    return this.http.post(this.baseUrl + "jaula", {jaula})
  }

  updateJaula(idJaula: number, jaula: any){
    return this.http.patch(this.baseUrl + "jaula/" + idJaula, {jaula: jaula})
  }

  deleteJaula(idJaula: number){
    return this.http.delete(this.baseUrl + "jaula/" + idJaula)
  }
}
