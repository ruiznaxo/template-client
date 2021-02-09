import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlimentarService } from './alimentar.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { Jaula, Linea, Alimentacion, Dosificador, Silo, Alarma, TipoAlarma, Programacion } from './alimentar';
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
    { id: 1, formula: "KGM" },
    { id: 2, formula: "PPM" },
    { id: 3, formula: "KTM" },
  ]

  selectedFormula: number = 2;

  breadCrumbItems: Array<{}>;

  jaulas: Jaula[];

  lineas: Linea[];

  alarmas: Alarma[];

  alimentaciones: Alimentacion[];

  dosificadores: Dosificador[];

  silos: Silo[];

  programaciones: Programacion[];

  tipoAlarmas: TipoAlarma[];

  tasaOptions: { idJaula: number, options: Options }[] = [];

  hzpausaOptions: Options = {
    ceil: 50,
    floor: 0,
    step: 1
  }

  private unsubscribe = new Subject<void>();


  constructor(public alimentarService: AlimentarService, public wsService: WebsocketService, public modalService: NgbModal) {

  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Alimentar', active: true }];

    this.loadData();

    this.wsService.listen("all-lineas").subscribe((data: Linea[]) => {
      this.checkChanges(this.lineas, data)
    })
    this.wsService.listen("all-jaulas").subscribe((data: Jaula[]) => {
      this.checkChanges(this.jaulas, data)
    })
    this.wsService.listen("all-alimentaciones").subscribe((data: Alimentacion[]) => {
      this.checkChanges(this.alimentaciones, data)
    })
    this.wsService.listen("all-alarmas").subscribe((data: Alarma[]) => {
      this.checkChanges(this.alarmas, data)
    })
  }


  checkChanges(thisArray: any[], socketArray: any[]) {
    if (thisArray && socketArray) {
      for (let i = 0; i < socketArray.length; i++) {
        if (JSON.stringify(socketArray[i]) !== JSON.stringify(thisArray[i])) {
          thisArray[i] = socketArray[i];
        }
      }
    }
  }


  loadData() {
    let listaPeticionesHttp = [
      this.alimentarService.getLineas(),
      this.alimentarService.getJaulas(),
      this.alimentarService.getProgramaciones(),
      this.alimentarService.getAlimentaciones(),
      this.alimentarService.getDosificadores(),
      this.alimentarService.getSilos(),
      this.alimentarService.getAlarmas(),
      this.alimentarService.getTipoAlarmas(),
    ]


    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([lineas, jaulas, programaciones, alimentaciones, dosificadores, silos, alarmas, tipoAlarmas]) => {
        //console.log(lineas);

        this.lineas = lineas;
        // jaulas.map(x => x.estado = 0)
        // jaulas.map(x => x.claseEstado = this.setClaseEstado(x.estado))
        this.jaulas = jaulas
        this.alimentaciones = alimentaciones;
        this.dosificadores = dosificadores;
        this.programaciones = programaciones;
        this.silos = silos;
        this.alarmas = alarmas;
        this.tipoAlarmas = tipoAlarmas;

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

    let jaula = this.jaulas.find(x => x.ID === idJaula)
    let doser = this.dosificadores.find(doser => doser.ID === jaula.IDDOSIFICADOR)
    let silo = this.silos.find(x => x.ID === doser.IDSILO);
    let pelletKilo = silo.PELLETKILO

    switch (this.selectedFormula) {
      case 1:
        //Kg / min
        return Math.round(jaula.TASA * 0.06)
      case 2:
        //Get Pellet kilo de silo        
        return Number((jaula.TASA * 0.06 * pelletKilo / jaula.CANTIDADPECES))
      case 3:
        //Tonelada
        let biomasa = (jaula.CANTIDADPECES * (jaula.PESOPROMEDIO / 1000)) / 1000
        return Number((jaula.TASA * 0.06 / biomasa))
      default:
        break;
    }
  }


  setTasa(event, idJaula) {

    let jaula = this.jaulas.find(x => x.ID === idJaula)
    let doser = this.dosificadores.find(doser => doser.ID === jaula.IDDOSIFICADOR)
    let silo = this.silos.find(x => x.ID === doser.IDSILO);
    let pelletKilo = silo.PELLETKILO

    let tasaJaula = 0;

    switch (this.selectedFormula) {
      case 1:
        tasaJaula = event.value / 0.06
        console.log("KGM", tasaJaula);
        break;
      case 2:
        tasaJaula = event.value / 0.06 / pelletKilo * jaula.CANTIDADPECES
        console.log("PPM", tasaJaula);
        break;
      case 3:
        let biomasa = (jaula.CANTIDADPECES * (jaula.PESOPROMEDIO / 1000)) / 1000
        tasaJaula = event.value / 0.06 * biomasa
        console.log("KTM", tasaJaula);
        break;

      default:
        break;
    }

  }

  setOptions(jaulas: Jaula[], dosificadores: Dosificador[]) {
    if (jaulas && dosificadores) {
      jaulas.forEach(jaula => {
        let tasamax = 0;
        let step = 1;

        switch (this.selectedFormula) {
          case 1:
            //Kg / min
            tasamax = Math.round(dosificadores.find(doser => doser.ID === jaula.IDDOSIFICADOR).TASAMAX * 0.06)
            step = 1
            break;
          case 2:
            //Get Pellet kilo de silo
            let doser = dosificadores.find(doser => doser.ID === jaula.IDDOSIFICADOR)
            let silo = this.silos.find(x => x.ID === doser.IDSILO);
            let pelletKilo = silo.PELLETKILO
            tasamax = Number((doser.TASAMAX * 0.06 * pelletKilo / jaula.CANTIDADPECES))
            step = 0.01
            break;
          case 3:
            //Tonelada
            let biomasa = (jaula.CANTIDADPECES * (jaula.PESOPROMEDIO / 1000)) / 1000
            tasamax = Number((dosificadores.find(doser => doser.ID === jaula.IDDOSIFICADOR).TASAMAX * 0.06 / biomasa))
            step = 0.001
            break;
          default:
            tasamax = 0
            break;
        }

        //console.log(tasamax);      

        if (this.tasaOptions.find(x => x.idJaula === jaula.ID)) {
          this.tasaOptions.find(x => x.idJaula === jaula.ID).options = {
            floor: 0,
            ceil: tasamax,
            step: step
          }
        } else {
          this.tasaOptions.push({
            idJaula: jaula.ID, options: {
              floor: 0,
              ceil: tasamax,
              step: step
            }
          });
        }
      });
    }
  }

  getOptions(idJaula: number) {
    return this.tasaOptions.find(x => x.idJaula === idJaula).options;
  }

  getNombreTipoAlarma(idTipoAlarma) {
    return this.tipoAlarmas.find(tipo => tipo.ID === idTipoAlarma).TIPOALARMA
  }

  getNombreProgramacion(idTProgrmacion) {
    return this.programaciones.find(tipo => tipo.ID === idTProgrmacion).NOMBRE
  }

  setEstadoLinea(idLinea: number, estado: number) {
    this.alimentarService.updateEstadoLinea(idLinea, estado).subscribe(() => { })
  }

  getBorderCard(tipoEstado: number, alarma: number) {

    let style;

    switch (tipoEstado) {
      case 1:
        style = "card border border-secondary";
        break;
      case 2:
        style = "card border border-warning";
        break;
      case 3:
        style = "card border border-success";
        break;
      default:
        break;
    }

    if (alarma) {
      style = "card border border-danger"
    }

    return style;
  }

  updateHzPausa(event, idlinea: number) {
    this.alimentarService.updateHzPausa(idlinea, event.value).subscribe(() => { })
  }

  logCheck(idJula: number) {
    let jaula = this.jaulas.find(x => x.ID === idJula);
    this.alimentarService.setJaulaHabilitada(idJula, jaula.HABILITADA).subscribe();
  }

  cambiarHabilitada(idJula: number) {
    let jaula = this.jaulas.find(x => x.ID === idJula);
    let value = !jaula.HABILITADA
    this.alimentarService.setJaulaHabilitada(idJula, value).subscribe();
  }

  getIniciarTooltip(idLInea): string {
    let linea = this.lineas.find(linea => linea.ID == idLInea);
    let jaulas = this.jaulas.filter(jaulas => jaulas.IDLINEA === idLInea);

    if (linea.ESTADO === 3 || linea.ALARMA) {
      return "";
    }

    if (this.jaulasHabilitadas(idLInea)) {
      return "Debe Habilitar Jaulas"
    }

  }

  jaulasHabilitadas(idLinea): boolean {
    let jaulas = this.jaulas.filter(jaulas => jaulas.IDLINEA === idLinea);
    let disableTooltip = true;

    for (let index = 0; index < jaulas.length; index++) {
      if (jaulas[index].HABILITADA) {
        disableTooltip = false;
        break;
      }      
    }

    return disableTooltip;

  }

}
