import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlimentarService } from './alimentar.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { Jaula } from './jaula';
import { forkJoin } from 'rxjs';
import { NgbModal, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-alimentar',
  templateUrl: './alimentar.component.html',
  styleUrls: ['./alimentar.component.scss']
})
export class AlimentarComponent implements OnInit, OnDestroy {

  active = 1;

  breadCrumbItems: Array<{}>;

  jaulas: Jaula[] = [
    {
    id: 1,
    nombre: "1111"
    },
    {
    id: 2,
    nombre: "2222"
    },
  ]

  constructor(public alimentarService: AlimentarService, public wsService: WebsocketService, public modalService: NgbModal) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Alimentar', active: true }];

    let listaPeticionesHttp = [
      this.alimentarService.getJaulas(), 
      this.alimentarService.getLineas(), 
      this.alimentarService.getProgramaciones(),
      this.alimentarService.getAlimentaciones()
    ]
    

    forkJoin(listaPeticionesHttp).subscribe(res => {
      res[0].map( x => x.estado = 3)
      res[0].map( x => x.claseEstado = this.setClaseEstado(x.estado))
      this.jaulas = res[0];
      console.log(this.jaulas);  
    });

    console.log(this.jaulas);
    

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
    let jaula = this.jaulas.find( x=> x.id === idJaula)
    jaula.estado = 4;
    this.jaulas.find( x=> x.id === idJaula).claseEstado = this.setClaseEstado(jaula.estado)

    //peticion patch
  }

  activar(idJaula: number){
    let jaula = this.jaulas.find( x=> x.id === idJaula)
    jaula.estado = 0;
    this.jaulas.find( x=> x.id === idJaula).claseEstado = this.setClaseEstado(jaula.estado)

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


}
