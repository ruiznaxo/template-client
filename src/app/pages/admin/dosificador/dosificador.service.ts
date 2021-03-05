import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';
import { Dosificador } from '../../alimentar/alimentar';

@Injectable({
  providedIn: 'root'
})
export class DosificadorService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl  
  } 

  getDosificadores(): Observable<any>{
    return this.http.get(this.baseUrl + "dosificador")
  }

  addDosificador(dosificador: any) {
    return this.http.post(this.baseUrl + "dosificador", dosificador)
  }

  updateDosificador(idDosificador: number, dosificador: any){
    return this.http.patch(this.baseUrl + "dosificador/" + idDosificador, dosificador)
  }

  deleteDosificador(idDosificador: number){
    return this.http.delete(this.baseUrl + "dosificador/" + idDosificador)
  }
}
