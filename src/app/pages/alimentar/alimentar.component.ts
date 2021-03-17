import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlimentarService } from './alimentar.service';
import { WebsocketService } from '../../core/services/websocket.service';
import { Jaula, Linea, Alimentacion, Dosificador, Silo, Alarma, TipoAlarma, Programacion, Selectora } from './alimentar';
import { forkJoin, Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Options } from '@angular-slider/ngx-slider';
import { takeUntil } from 'rxjs/operators';

import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-alimentar',
  templateUrl: './alimentar.component.html',
  styleUrls: ['./alimentar.component.scss']
})
export class AlimentarComponent implements OnInit, OnDestroy {

  //Array de Formulas para Seleccionar sobre slider de TASA
  tasaSelect: { id: number, formula: string }[] = [
    { id: 1, formula: "KGM" },
    { id: 2, formula: "PPM" },
    { id: 3, formula: "KTM" },
  ]
  //Formula Seleccionada por defecto y actualizable cuando de cambia con ngModel
  selectedFormula: number = 1;

  //propositos de Template
  breadCrumbItems: Array<{}>;

  //Arreglos que Contienen los datos 
  jaulas: Jaula[];
  lineas: Linea[];
  alarmas: Alarma[];
  alimentaciones: Alimentacion[];
  dosificadores: Dosificador[];
  silos: Silo[];
  selectoras: Selectora[];
  programaciones: Programacion[];
  tipoAlarmas: TipoAlarma[];

  //Jaula a Actualizar parametros en popup
  jaulaPopUp: Jaula;
  //Lista de Silos para popup
  silosPopUp: Silo[];

  //opciones slider tasa en popup
  opcionesTasa: Options = {
    ceil: 50,
    floor: 0,
    step: 1
  }

  //opciones slider FACTOR ACTIVIDAD en popup
  opcionesFactor: Options = {
    ceil: 200,
    floor: 50,
    step: 1
  }

  //Opciones para slider de HZ
  hzpausaOptions: Options = {
    ceil: 50,
    floor: 0,
    step: 1,
    ariaLabel: "%"
  }

  tasaEnGramos: number;

  //Array para elegir la salida de la selectora
  salidasSelectora: number[];

  //Formulario que contiene los valores de los parametros por jaula
  parametrosForm: FormGroup;

  //tooltip para cuando el tiempo de espera está desactivado
  tiempoEsperaTooltip = ""

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();

  constructor(public alimentarService: AlimentarService, public wsService: WebsocketService, public modalService: NgbModal,
    private formBuilder: FormBuilder) {

    this.parametrosForm = new FormGroup({
      monorracion: new FormControl(),
      posicionSelectora: new FormControl(),
      silo: new FormControl(),
      tiempoSoplado: new FormControl(),
      tiempoEspera: new FormControl(),
      hzSoplador: new FormControl(),
      tasa: new FormControl(),
      factorActividad: new FormControl(),
    });

  }

  ngOnInit(): void {
    registerLocaleData(es);

    this.parametrosForm = this.formBuilder.group({
      monorracion: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(4)]],
      posicionSelectora: ['', [Validators.required]],
      silo: ['', [Validators.required]],
      tiempoSoplado: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(4)]],
      tiempoEspera: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(4)]],
      hzSoplador: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(2)]],
      tasa: ['', [Validators.required]],
      factorActividad: ['', [Validators.pattern('^[0-9]*$'), Validators.required, Validators.maxLength(3)]],
    });

    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Alimentar', active: true }];

    //Peticiones HTTP cuando se inicia el componente
    this.loadData();

    //Escuchas de Sockets
    this.wsService.listen("all-lineas").subscribe((data: Linea[]) => {
      this.checkSocketChanges(this.lineas, data)
    })
    this.wsService.listen("all-jaulas").subscribe((data: Jaula[]) => {
      this.checkSocketChanges(this.jaulas, data, true)
    })
    this.wsService.listen("all-alimentaciones").subscribe((data: Alimentacion[]) => {
      this.checkSocketChanges(this.alimentaciones, data)
    })
    this.wsService.listen("all-alarmas").subscribe((data: Alarma[]) => {
      this.checkSocketChanges(this.alarmas, data)
    })
  }

  //Comprueba si lo que viene de los sockets es distinto a lo que tiene la clase
  checkSocketChanges(thisArray: any[], socketArray: any[], isJaula?: boolean) {
    if (thisArray && socketArray) {
      for (let i = 0; i < socketArray.length; i++) {
        if (JSON.stringify(socketArray[i]) !== JSON.stringify(thisArray[i])) {
          thisArray[i] = socketArray[i];
          if (isJaula && this.jaulaPopUp) {
            if (thisArray[i].ID === this.jaulaPopUp.ID && this.jaulaPopUp) {
              this.jaulaPopUp = thisArray[i];
              this.updateJaulaPopup(this.jaulaPopUp)
            }
          }
        }
      }
    }
  }

  //llama las peticiones http y asigna los datos 
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
      this.alimentarService.getSelectoras(),
    ]


    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([lineas, jaulas, programaciones, alimentaciones, dosificadores, silos, alarmas, tipoAlarmas, selectoras]) => {
        this.lineas = lineas;
        this.jaulas = jaulas
        this.alimentaciones = alimentaciones;
        this.dosificadores = dosificadores;
        this.programaciones = programaciones;
        this.silos = silos;
        this.alarmas = alarmas;
        this.tipoAlarmas = tipoAlarmas;
        this.selectoras = selectoras;

        console.log(this.programaciones);
        

      });

  }

  //para cerrar las subscripciones
  ngOnDestroy() {
    //cancelar suscripciones
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  //cambia la formula seleccionada para la tasa
  cambioFormula() {
    if (this.jaulas && this.dosificadores) {
      this.setTasaOptions();      
      this.setTasa({value: this.getTasaVisible(this.jaulaPopUp.ID)}, this.jaulaPopUp.ID)
    }
  }

  //abre el popup
  showPopup(scrollDataModal: any, idJaula) {
    this.jaulaPopUp = this.jaulas.find(jaula => jaula.ID === idJaula)

    this.updateJaulaPopup(this.jaulaPopUp)
    this.setTasaOptions();

    let dosificadores = this.dosificadores.filter(doser => doser.IDLINEA === this.jaulaPopUp.IDLINEA).map(a => a.ID);
    this.silosPopUp = this.silos.filter((({ ID }) => dosificadores.includes(ID)));

    this.modalService.open(scrollDataModal, { size: 'lg', scrollable: true, centered: true });

  }

  //asigna los datos de los parametros segun la jaula (popup)
  updateJaulaPopup(jaula: Jaula) {
    let selectora = this.selectoras.find(s => s.ID === jaula.IDSELECTORA)
    this.salidasSelectora = Array.from({ length: selectora.SALIDAS }, (_, i) => i + 1)

    this.parametrosForm.setValue({
      monorracion: jaula.MONORRACION,
      posicionSelectora: jaula.POSICIONSELECTORA,
      silo: jaula.IDDOSIFICADOR,
      tiempoSoplado: jaula.TIEMPOSOPLADO,
      tiempoEspera: jaula.TIEMPOESPERA,
      hzSoplador: jaula.HZSOPLADOR,
      tasa: this.getTasaVisible(jaula.ID),
      factorActividad: jaula.FACTORACTIVIDAD,
    });

    this.setTasa({value: this.getTasaVisible(this.jaulaPopUp.ID)}, this.jaulaPopUp.ID)
    this.disableTiempoEspera(jaula.IDLINEA)
  }

  //update de parametros en servidor de acuerdo al popup
  setParametros() {
    let idlinea = this.lineas.find(x => x.ID === this.jaulaPopUp.IDLINEA).ID;    
    let doserId = this.dosificadores.find(d => d.IDSILO === this.parametrosForm.value.silo && d.IDLINEA ===idlinea).ID;

    let parametrosJaula = {
      monorracion: this.parametrosForm.value.monorracion,
      posicionSelectora: this.parametrosForm.value.posicionSelectora,
      tiempoSoplado: this.parametrosForm.value.tiempoSoplado,
      tiempoEspera: this.parametrosForm.value.tiempoEspera,
      hzSoplador: this.parametrosForm.value.hzSoplador,
      tasa: this.tasaEnGramos,
      factorActividad: this.parametrosForm.value.factorActividad,
      iddosificador: doserId
    }

    this.alimentarService.setParametros(this.jaulaPopUp.ID, parametrosJaula).subscribe(() => {
      this.modalService.dismissAll();
    });

  }

  //obtiene el valor del slider, de acuerdo con la formula seleccionada
  getTasaVisible(idJaula: number): number {

    let jaula = this.jaulas.find(x => x.ID === idJaula)
    let doser = this.dosificadores.find(doser => doser.ID === jaula.IDDOSIFICADOR)
    let silo = this.silos.find(x => x.ID === doser.IDSILO);
    let pelletKilo = silo.PELLETKILO

    // switch (this.selectedFormula.id) {
    switch (this.selectedFormula) {
      case 1:
        //Kg / min
        return Number(jaula.TASA * 0.06)
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

  //de acurdo a la formula seleccioanda asigna la tasa en gramos
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
        console.log(event.value);        
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


    this.tasaEnGramos = tasaJaula;

  }

  //De acuerdo a la formula seleccionada asigna las opciones del slider
  setTasaOptions(){
    let tasamax = 0;
    let step = 1;
    let jaula = this.jaulaPopUp;
    let doser = this.dosificadores.find(d => d.ID === jaula.IDDOSIFICADOR)

    switch (this.selectedFormula) {
      case 1:
        //Kg / min
        tasamax = Number(doser.TASAMAX * 0.06)
        step = 1
        break;
      case 2:
        //Get Pellet kilo de silo
        let silo = this.silos.find(x => x.ID === doser.IDSILO);
        let pelletKilo = silo.PELLETKILO
        tasamax = Number((doser.TASAMAX * 0.06 * pelletKilo / jaula.CANTIDADPECES))
        step = 0.01
        break;
      case 3:
        //Tonelada
        let biomasa = (jaula.CANTIDADPECES * (jaula.PESOPROMEDIO / 1000)) / 1000
        tasamax = Number(doser.TASAMAX * 0.06 / biomasa)
        step = 0.001
        break;
      default:
        tasamax = 0
        break;
    } 

    this.opcionesTasa = {
      floor: 0,
      ceil: tasamax,
      step: step
    }

  }

  getNombreTipoAlarma(idTipoAlarma) {
    return this.tipoAlarmas.find(tipo => tipo.ID === idTipoAlarma).TIPOALARMA
  }

  getNombreProgramacion(idTProgrmacion) {
    return idTProgrmacion ? this.programaciones.find(tipo => tipo.ID === idTProgrmacion).NOMBRE : "Sin Asignar"
  }

  setEstadoLinea(idLinea: number, estado: number) {
    this.alimentarService.updateEstadoLinea(idLinea, estado).subscribe(() => { })
  }

  //Color de la Linea segun estado
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

  cambiarHabilitada(idJaula: number) {
    let jaula = this.jaulas.find(x => x.ID === idJaula);
    let value = !jaula.HABILITADA
    this.alimentarService.setJaulaHabilitada(idJaula, value).subscribe();
  }

  //Si no hay jaulas habilitadas muestra el mensaje en tooltip
  getIniciarTooltip(idLInea): string {
    let linea = this.lineas.find(linea => linea.ID == idLInea);

    if (linea.ESTADO === 3 || linea.ALARMA) {
      return "";
    }

    if (this.jaulasHabilitadas(idLInea)) {
      return "Debe Habilitar Jaulas"
    }

  }

  //Verifica si existe por lo menos una jaula habilitada
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

  //verifica si todas las jaulas estan desabilitadas
  disableTiempoEspera(idLinea) {
    let jaulas = this.jaulas.filter(jaulas => jaulas.IDLINEA === idLinea);
    this.parametrosForm.controls.tiempoEspera.disable();
    this.tiempoEsperaTooltip = "No hay Jaulas Deshabilitadas"
    

    for (let index = 0; index < jaulas.length; index++) {
      if (!jaulas[index].HABILITADA) {
        this.parametrosForm.controls.tiempoEspera.enable();
        this.tiempoEsperaTooltip = ""
        
        break;
      }
    }

    

  }

}
