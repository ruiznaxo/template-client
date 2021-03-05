import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Linea } from '../../alimentar/alimentar';

@Injectable({
  providedIn: 'root'
})
export class LineaService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl  
  } 

  getLineas(): Observable<any>{
    return this.http.get(this.baseUrl + "linea")
  }

  addLinea(linea: any) {
    return this.http.post(this.baseUrl + "linea", linea)
  }

  updateLinea(idLinea: number, linea: any){
    return this.http.patch(this.baseUrl + "linea/" + idLinea, linea)
  }

  deleteLinea(idLinea: number){
    return this.http.delete(this.baseUrl + "linea/" + idLinea)
  }
}
