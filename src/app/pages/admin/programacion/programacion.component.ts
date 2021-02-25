import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.scss'],
})
export class ProgramacionComponent extends TableCallbackInjectable implements OnInit {

  @ViewChild(ProgramacionEditComponent) child:ProgramacionEditComponent;

  table: ITable = {
    title: "Lista Programaciones",
    actionsColumn: {
      active: true,
      buttons: [
        {
          icon: "edit-alt",
          tooltip: "Editar",
          event: "openEditPopup",
        },
        {
          icon: "trash",
          tooltip: "Eliminar",
          disabledTooltip: "Programación en uso",
          event: "openConfirmPopup",
          fieldDisabledValue: "disableDelete"
        }
      ]
    },
    buttons: [
      {
        event: "openAddPopup",
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

  showEditpopup : boolean = false;
  showAddpopup : boolean = false;
  confirmPopup : boolean = false;

  //propositos de Template
  breadCrumbItems: Array<{}>;

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();

  programaciones: Programacion[]
  lineas: Linea[]

  constructor(private programacionService: ProgramacionService, private alimentarService: AlimentarService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Programación', active: true }];

    //Peticiones HTTP cuando se inicia el componente
    this.loadData();
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
        this.table.data = this.programaciones
        this.table.auxData = this.programaciones
      });
  }

  openEditPopup(programacion: Programacion){


    // console.log(programacion);

    // this.child.openPopup(this.child)
    
    //this.showEditpopup = true
  }

  openAddPopup(){
    console.log("im here");
    
    this.child.openPopup(this.child)
  }

  openConfirmPopup(programacion: Programacion){
    console.log(programacion.ID);
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
          Swal.fire('¡Borrada!', `Programación ${programacion.NOMBRE} eliminada`, 'success');

          (err) => console.log(err)
          
          //this.loadData;      
        })
        
      }
    });
  }

  addProgramacion(programacion: Programacion){
    this.programacionService.addProgramacion(programacion).subscribe(() => {
      this.loadData();
    })
  }

  editProgramacion(programacion: Programacion) {
    this.programacionService.updateProgramacion(programacion.ID, programacion).subscribe(() => this.loadData())
  }

  deleteProgramacion(idProgramacion: number){    
    this.programacionService.deleteProgrmacion(idProgramacion).subscribe(() => {
      this.loadData;      
    })    
  }

  setDisabledField(programacion){
    if(this.lineas.find(l => l.IDPROGRAMACION === programacion.ID)){      
      return true
    }
    return false;
  }




}
