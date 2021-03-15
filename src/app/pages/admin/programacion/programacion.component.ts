import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ITable } from '../../../shared/components/table/table';
import { ProgramacionService } from './programacion.service';
import { Linea, Programacion } from '../../alimentar/alimentar';
import { TableCallbackInjectable } from '../../../shared/components/table/table-injectable';
import { cloneDeep } from 'lodash';

import Swal from 'sweetalert2';
import { ProgramacionEditComponent } from './programacion-edit/programacion-edit.component';
import { AlimentarService } from '../../alimentar/alimentar.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.scss'],
})
export class ProgramacionComponent extends TableCallbackInjectable implements OnInit, OnDestroy {

  @ViewChild('scrollDataModal') popup: ElementRef;
  @ViewChild('asignarModal') asignarPopup: ElementRef;

  table: ITable = {
    title: "Lista Programaciones",
    actionsColumn: {
      active: true,
      buttons: [
        // {
        //   icon: "list-check",
        //   tooltip: "Asignar a Lineas",
        //   event: "openAsignarPopUp",
        // },
        {
          icon: "edit-alt",
          tooltip: "Editar",
          event: "openEditPopUp",
        },
        {
          icon: "trash",
          tooltip: "Eliminar",
          disabledTooltip: "Programación en uso",
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
      },
      {
        event: "openAsignarPopUp",
        icon: "list",
        text: "Asignar"
      }
    ],
    columns: [
      {
        name: "Nombre",
        prop: "NOMBRE",
        type: "text"
      },
      {
        name: "Horas",
        prop: "HORAS",
        type: "text"
      },
      {
        name: "Visitas",
        prop: "VISITAS",
        type: "text"
      },
      {
        name: "Kilos",
        prop: "KILOS",
        type: "decimal"
      }
    ],
    data: [],
    auxData: [],
    searchable: true

  }

  confirmPopup : boolean = false;

  //propositos de Template
  breadCrumbItems: Array<{}>;

  editProgramacion: Programacion;
  asignarProgramacion: Programacion;

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();

  programaciones: Programacion[]
  lineas: Linea[]

  constructor(public modalService: NgbModal, private programacionService: ProgramacionService, private alimentarService: AlimentarService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Programación', active: true }];

    //Peticiones HTTP cuando se inicia el componente
    this.loadData();
  }

  ngOnDestroy(){
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  loadData() {

    let listaPeticionesHttp = [
      this.alimentarService.getLineas(),
      this.programacionService.getProgramaciones()
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([lineas, programaciones]) => {
        this.lineas = lineas

        programaciones.map(p => p.disableDelete = this.setDisabledField(p))    
        this.programaciones = programaciones;   
        console.log(programaciones);
             
        this.table.data = this.programaciones
        this.table.auxData = this.programaciones
      });
  }

  setDisabledField(programacion){
    if(this.lineas.find(l => l.IDPROGRAMACION === programacion.ID)){      
      return true
    }
    return false;
  }

  openSavePopUp(){
    this.editProgramacion = undefined
    this.modalService.open(this.popup, { size: 'lg', centered: true, backdrop: "static" })
  }

  openEditPopUp(data){
    this.editProgramacion = data;    
    this.modalService.open(this.popup, { size: 'lg', centered: true, backdrop: "static" })
  }

  openAsignarPopUp(data){
    this.asignarProgramacion = data    
    this.modalService.open(this.asignarPopup, { size: 'lg', scrollable: true, centered: true,  backdrop: "static" })
  }


  openDeleteConfirm(programacion: Programacion){
    this.confirmPopup = true
    Swal.fire({
      title: `¿Eliminar Programación ${programacion.NOMBRE}?`,
      text: '¡Esto no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#556ee6',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {

        this.programacionService.deleteProgrmacion(programacion.ID)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          const f = this.table.data.findIndex(item => {
            return programacion.ID === item.ID;
          });
          this.programaciones = this.programaciones.filter(p => p.ID !== programacion.ID);
          this.table.data.splice(f, 1);
          this.table.data = cloneDeep(this.table.data);
          Swal.fire('¡Borrado!', `Programación ${programacion.NOMBRE} eliminada`, 'success');

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
