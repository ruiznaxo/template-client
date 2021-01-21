import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlimentarService } from './alimentar.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { Jaula, Linea, Alimentacion, Dosificador } from './alimentar';
import { forkJoin } from 'rxjs';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'app-alimentar',
  templateUrl: './alimentar.component.html',
  styleUrls: ['./alimentar.component.scss']
})
export class AlimentarComponent implements OnInit, OnDestroy {

  active = 1;

  breadCrumbItems: Array<{}>;

  jaulas: Jaula[];

  lineas: Linea[];

  alimentaciones: Alimentacion[];

  dosificadores: Dosificador[];

  defaultVal = 34;
  tasaOptions: Options = {
    floor: 1,
    ceil: 100
  };
  

  constructor(public alimentarService: AlimentarService, public wsService: WebsocketService, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Alimentar', active: true }];

    let listaPeticionesHttp = [
      this.alimentarService.getLineas(), 
      this.alimentarService.getJaulas(), 
      this.alimentarService.getProgramaciones(),
      this.alimentarService.getAlimentaciones(),
      this.alimentarService.getDosificadores()
    ]
    

    forkJoin(listaPeticionesHttp).subscribe(res => {
      console.log(res[0]);
      
      this.lineas = res[0];
      res[1].map( x => x.estado = 0)
      res[1].map( x => x.claseEstado = this.setClaseEstado(x.estado))
      this.jaulas = res[1];
      this.alimentaciones = res[3];
      this.dosificadores = res[4]
      
    });

    

    this.wsService.listen("real-time").subscribe((data) => {
        console.log(data);        
    })    

  }

  ngOnDestroy(){
    //cancelar suscripciones
  }
  

  scrollModal(scrollDataModal: any) {
    this.modalService.open(scrollDataModal, { scrollable: true, centered: true });
  }

  desactivar(idJaula: number){
    let jaula = this.jaulas.find( x=> x.ID === idJaula)
    jaula.estado = 4;
    this.jaulas.find( x=> x.ID === idJaula).claseEstado = this.setClaseEstado(jaula.estado)

    //peticion patch
  }

  activar(idJaula: number){
    let jaula = this.jaulas.find( x=> x.ID === idJaula)
    jaula.estado = 0;
    this.jaulas.find( x=> x.ID === idJaula).claseEstado = this.setClaseEstado(jaula.estado)

    //peticion patch
  }

  setClaseEstado(estado: number): string{
    switch (estado) {
      case 0:
        return "btn btn-primary"
      case 1:
        return "btn btn-success"
      case 2:
        return "btn btn-info"
      case 3:
        return "btn btn-danger"    
      case 4:
        return "btn btn-secondary"    
      default:
        return "btn btn-primary";
    }
  }


  getTasaMax(idDoser: number): number{
    let tasamax = this.dosificadores.find( doser => doser.ID === idDoser).TASAMAX
    console.log(tasamax);
    
    return this.dosificadores.find( doser => doser.ID === idDoser).TASAMAX
  }


}
