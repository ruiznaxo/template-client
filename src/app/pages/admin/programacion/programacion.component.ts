import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITable } from '../../../shared/components/table/table';
import { ProgramacionService } from './programacion.service';
import { Programacion } from '../../alimentar/alimentar';
import { TableCallbackInjectable } from '../../../shared/components/table/table-injectable';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.scss']
})
export class ProgramacionComponent extends TableCallbackInjectable implements OnInit {

  table: ITable = {
    title: "Lista Programaciones",
    actionsColumn: {
      active: true,
      buttons: [
        {
          icon: "edit-alt",
          tooltip: "Editar",
          event: "openEditPopup"
        },
        {
          icon: "trash",
          tooltip: "Eliminar",
          event: "openConfirmPopup"
        }
      ]
    },
    columns: [
      {
        name: "Nombre",
        prop: "NOMBRE",
      },
      {
        name: "Horas",
        prop: "HORAS",
      },
      {
        name: "Visitas",
        prop: "VISITAS",
      },
      {
        name: "Kilos",
        prop: "KILOS",
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

  constructor(private programacionService: ProgramacionService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Programación', active: true }];

    //Peticiones HTTP cuando se inicia el componente
    this.loadData();
  }

  loadData() {
    this.programacionService.getProgramaciones().pipe(takeUntil(this.unsubscribe))
      .subscribe((programaciones: Programacion[]) => {
        this.programaciones = programaciones;
        this.table.data = this.programaciones
        this.table.auxData = this.programaciones
      });
  }

  openEditPopup(programacion: Programacion){
    console.log(programacion);
    
    this.showEditpopup = true
  }

  openAddPopup(){
    this.showAddpopup = true
  }

  openConfirmPopup(programacion: Programacion){
    console.log(programacion.ID);
    this.confirmPopup = true
  }

  addProgramacion(programacion: Programacion){
    this.programacionService.addProgramacion(programacion).subscribe(() => {
      this.loadData();
    })
  }

  editProgramacion(programacion: Programacion) {
    this.programacionService.updateProgramacion(programacion.ID, programacion).subscribe(() => this.loadData())
  }

  deleteProgramacion(programacion: Programacion){
    
    this.programacionService.deleteProgrmacion(programacion.ID).subscribe(() => {
      this.loadData;
    })
    
  }


}
