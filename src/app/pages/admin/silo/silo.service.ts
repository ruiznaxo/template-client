import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Silo } from '../../alimentar/alimentar';

@Injectable({
  providedIn: 'root'
})
export class SiloService {

  baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl  
  } 

  getSilos(): Observable<any>{
    return this.http.get(this.baseUrl + "silo")
  }

  addSilo(silo: any) {
    return this.http.post(this.baseUrl + "silo", {silo: silo})
  }

  updateSilo(idSilo: number, silo: any){
    return this.http.patch(this.baseUrl + "silo/" + idSilo, {silo: silo})
  }

  deleteSilo(idSilo: number){
    return this.http.delete(this.baseUrl + "silo/" + idSilo)
  }
}
