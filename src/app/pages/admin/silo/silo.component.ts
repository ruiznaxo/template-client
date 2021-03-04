import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ITable } from 'src/app/shared/components/table/table';
import { TableCallbackInjectable } from 'src/app/shared/components/table/table-injectable';
import Swal from 'sweetalert2';
import { Dosificador, Silo } from '../../alimentar/alimentar';
import { AlimentarService } from '../../alimentar/alimentar.service';
import { SiloService } from './silo.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-silo',
  templateUrl: './silo.component.html',
  styleUrls: ['./silo.component.scss']
})
export class SiloComponent extends TableCallbackInjectable implements OnInit, OnDestroy {

  //propositos de Template
  breadCrumbItems: Array<{}>;

  @ViewChild('scrollDataModal') popup: ElementRef;

  table: ITable = {
    title: "Lista ilos",
    actionsColumn: {
      active: true,
      buttons: [
        {
          icon: "edit-alt",
          tooltip: "Editar",
          event: "openEditPopUp",
        },
        {
          icon: "trash",
          tooltip: "Eliminar",
          disabledTooltip: "Silo en uso",
          event: "openDeleteConfirm",
          fieldDisabledValue: "disableDelete"
        }
      ]
    },
    buttons: [
      {
        event: "openSavePopUp",
        icon: "plus",
        text: "Agregar"
      }
    ],
    columns: [
      {
        name: "Nombre",
        prop: "NOMBRE",
        type: "text"
      },
      {
        name: "Alimento",
        prop: "ALIMENTO",
        type: "text"
      },
      {
        name: "Saldo (Kg)",
        prop: "SALDO",
        type: "decimal"
      },
      {
        name: "Capacidad (Kg)",
        prop: "CAPACIDAD",
        type: "decimal"
      },
      {
        name: "Pellet Kilo (gr)",
        prop: "PELLETKILO",
        type: "decimal"
      },
      {
        name: "Medicado",
        prop: "MEDICADO",
        type: "checkbox"
      },
    ],
    data: [],
    auxData: [],
    searchable: true

  }

  silos: Silo[]
  dosificadores: Dosificador[]
  confirmPopup: boolean = false;

  editSilo: Silo;

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();


  constructor(public alimentarService: AlimentarService, public siloService: SiloService, public modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Silos', active: true }];
    this.loadData()
  }

  ngOnDestroy() {
    //cancelar suscripciones
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  loadData() {

    let listaPeticionesHttp = [
      this.alimentarService.getDosificadores(),
      this.siloService.getSilos()
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([dosificadores, silos]) => {
        this.dosificadores = dosificadores
        silos.map(s => s.CAPACIDAD = (s.CAPACIDAD / 1000))
        silos.map(s => s.SALDO = (s.SALDO / 1000))
        silos.map(p => p.disableDelete = this.setDisabledField(p))
        this.silos = silos;
        this.table.data = this.silos
        this.table.auxData = this.silos
      });
  }

  setDisabledField(silo) {
    if (this.dosificadores.find(d => d.IDSILO === silo.ID)) {
      return true
    }
    return false;
  }

  openSavePopUp(){
    this.editSilo = undefined
    this.modalService.open(this.popup, { size: 'lg', scrollable: true, centered: true, backdrop: "static" })
  }

  openEditPopUp(data){
    this.editSilo = data;    
    this.modalService.open(this.popup, { size: 'lg', scrollable: true, centered: true, backdrop: "static" })
  }

  openDeleteConfirm(silo: Silo){
    this.confirmPopup = true
    Swal.fire({
      title: `¿Eliminar Silo ${silo.NOMBRE}?`,
      text: '¡Esto no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#556ee6',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {

        this.siloService.deleteSilo(silo.ID)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          const f = this.table.data.findIndex(item => {
            return silo.ID === item.ID;
          });
          this.silos = this.silos.filter(p => p.ID !== silo.ID);
          this.table.data.splice(f, 1);
          this.table.data = cloneDeep(this.table.data);
          Swal.fire('¡Borrado!', `Silo ${silo.NOMBRE} eliminado`, 'success');

          (err) => console.log(err)
          
          //this.loadData;      
        })
        
      }
    });
  }

  aceptarPopupClick(event){
    this.loadData()  
    this.table.data = cloneDeep(this.table.data);
  }


}
