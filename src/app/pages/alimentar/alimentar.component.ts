import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlimentarService } from './alimentar.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { Jaula, Linea, Alimentacion, Dosificador } from './alimentar';
import { forkJoin, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Options } from '@angular-slider/ngx-slider';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-alimentar',
  templateUrl: './alimentar.component.html',
  styleUrls: ['./alimentar.component.scss']
})
export class AlimentarComponent implements OnInit, OnDestroy {

  active = 1;

  tasaSelect: { id: number, formula: string }[] = [
    { id: 1, formula: "Kg / min" },
    { id: 2, formula: "PPM / min" },
    { id: 3, formula: "Tonelada" },
  ]

  selectedFormula: number = 1;

  breadCrumbItems: Array<{}>;

  jaulas: Jaula[];

  lineas: Linea[];

  alimentaciones: Alimentacion[];

  dosificadores: Dosificador[];

  tasaOptions: { idJaula: number, options: Options }[] = [];

  private unsubscribe = new Subject<void>();


  constructor(public alimentarService: AlimentarService, public wsService: WebsocketService, public modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Alimentar', active: true }];

    this.wsService.listen("real-time").subscribe((data) => {
      console.log(data);
    })

  }

  loadData() {
    let listaPeticionesHttp = [
      this.alimentarService.getLineas(),
      this.alimentarService.getJaulas(),
      this.alimentarService.getProgramaciones(),
      this.alimentarService.getAlimentaciones(),
      this.alimentarService.getDosificadores()
    ]


    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe)).subscribe(([lineas, jaulas, programaciones, alimentaciones, dosificadores]) => {
        console.log(lineas);
        
        this.lineas = lineas;
        jaulas.map(x => x.estado = 0)
        jaulas.map(x => x.claseEstado = this.setClaseEstado(x.estado))
        this.jaulas = jaulas
        this.alimentaciones = alimentaciones;
        this.dosificadores = dosificadores

        if (this.jaulas && this.dosificadores) {
          this.setOptions(this.jaulas, this.dosificadores)
        }

      });

  }

  ngOnDestroy() {
    //cancelar suscripciones
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  cambioFormula() {
    if (this.jaulas && this.dosificadores) {

      this.setOptions(this.jaulas, this.dosificadores);
    }
  }


  scrollModal(scrollDataModal: any) {
    this.modalService.open(scrollDataModal, { scrollable: true, centered: true });
  }

  desactivar(idJaula: number) {
    let jaula = this.jaulas.find(x => x.ID === idJaula)
    jaula.estado = 4;
    this.jaulas.find(x => x.ID === idJaula).claseEstado = this.setClaseEstado(jaula.estado)

    //peticion patch
  }

  activar(idJaula: number) {
    let jaula = this.jaulas.find(x => x.ID === idJaula)
    jaula.estado = 0;
    this.jaulas.find(x => x.ID === idJaula).claseEstado = this.setClaseEstado(jaula.estado)

    //peticion patch
  }

  setClaseEstado(estado: number): string {
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


  getTasaVisible(idJaula: number): number {

    switch (this.selectedFormula) {
      case 1:
        //Kg / min
        return Math.round(this.jaulas.find(x => x.ID === idJaula).TASA * 0.06)
      case 2:
        //Get Pellet kilo de silo
        return Math.round(this.jaulas.find(x => x.ID === idJaula).TASA * 0.05)
      case 3:
        //Tonelada
        return Math.round(this.jaulas.find(x => x.ID === idJaula).TASA * 0.04)
      default:
        break;
    }
  }

  setOptions(jaulas: Jaula[], dosificadores: Dosificador[]) {
    if (jaulas && dosificadores) {
      jaulas.forEach(jaula => {
        let tasamax;

        switch (this.selectedFormula) {
          case 1:
            //Kg / min
            tasamax = Math.round(dosificadores.find(doser => doser.ID === jaula.IDDOSIFICADOR).TASAMAX * 0.06)
            break;
          case 2:
            //Get Pellet kilo de silo
            tasamax = Math.round(dosificadores.find(doser => doser.ID === jaula.IDDOSIFICADOR).TASAMAX)
            break;
          case 3:
            //Tonelada
            tasamax = Math.round(dosificadores.find(doser => doser.ID === jaula.IDDOSIFICADOR).TASAMAX)
            break;
          default:
            break;
        }

        console.log(tasamax);


        this.tasaOptions.push({
          idJaula: jaula.ID, options: {
            floor: 1,
            ceil: tasamax
          }
        });
      });
    }
  }

  getOptions(idJaula: number) {
    return this.tasaOptions.find(x => x.idJaula === idJaula).options;
  }


}
