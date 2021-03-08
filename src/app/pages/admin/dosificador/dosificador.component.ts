import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITable } from 'src/app/shared/components/table/table';
import { TableCallbackInjectable } from 'src/app/shared/components/table/table-injectable';
import Swal from 'sweetalert2';
import { Dosificador, Jaula, Linea } from '../../alimentar/alimentar';
import { AlimentarService } from '../../alimentar/alimentar.service';
import { DosificadorService } from '../dosificador/dosificador.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-dosificador',
  templateUrl: './dosificador.component.html',
  styleUrls: ['./dosificador.component.scss']
})
export class DosificadorComponent extends TableCallbackInjectable implements OnInit {

  @ViewChild('scrollDataModal') popup: ElementRef;

  //propositos de Template
  breadCrumbItems: Array<{}>;

  table: ITable = {
    title: "Lista Dosificadores",
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
          disabledTooltip: "Doser en uso",
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
        name: "Dosificador",
        prop: "ID",
        type: "text",
        sort: true
      },
      {
        name: "Prioridad",
        prop: "PRIORIDAD",
        type: "text",
        sort: true
      },
      {
        name: "Modelo Reductor",
        prop: "MODELOREDUCTOR",
        type: "text",
        sort: true
      },
      {
        name: "Tasamax",
        prop: "TASAMAX",
        type: "decimal",
        sort: true
      },
      {
        name: "Silo",
        prop: "IDSILO",
        type: "text",
        showedName: "nombreSilo"
      },
      {
        name: "Linea",
        prop: "IDLINEA",
        type: "text",
        showedName: "nombreLinea"
      }
    ],
    data: [],
    auxData: [],
    searchable: true

  }

  //Arrays de Objetos
  dosificadores: Dosificador[]
  jaulas: Jaula[]
  lineas: Linea[]

  //Objeto para editar
  editDoser: Dosificador;
  
  //popups
  confirmPopup : boolean = false;


  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();


  constructor(
    public dosificadorService: DosificadorService,
    public modalService: NgbModal, 
    private alimentarService: AlimentarService
    ) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Dosificadors', active: true }];

    this.loadData()
  }

  loadData() {

    let listaPeticionesHttp = [
      this.dosificadorService.getDosificadores(),
      this.alimentarService.getJaulas(),
      this.alimentarService.getLineas(),
      this.alimentarService.getSilos(),
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([dosificadores, jaulas, lineas, silos]) => {
        this.jaulas = jaulas;
        this.lineas = lineas;
        dosificadores.map(l => l.disableDelete = this.setDisabledField(l))  
        dosificadores.map(d => d.nombreLinea = this.alimentarService.getNombre(lineas, d.IDLINEA, "NOMBRE"))
        dosificadores.map(d => d.nombreSilo = this.alimentarService.getNombre(silos, d.IDSILO, "NOMBRE"))
        this.dosificadores = dosificadores
        this.table.data = this.dosificadores
        this.table.auxData = this.dosificadores
      });
  }

  setDisabledField(doser){
    if(this.jaulas.find(j => j.IDDOSIFICADOR === doser.ID)){      
      return true
    }
    return false;
  }

  openSavePopUp(){
    this.editDoser = undefined
    this.modalService.open(this.popup, { size: 'lg', centered: true, backdrop: "static" })
  }

  openEditPopUp(data){
    this.editDoser = data;    
    this.modalService.open(this.popup, { size: 'lg', centered: true, backdrop: "static" })
  }


  openDeleteConfirm(doser: Dosificador){
    this.confirmPopup = true
    Swal.fire({
      title: `¿Eliminar Dosificador ${doser.ID}?`,
      text: '¡Esto no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#556ee6',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {

        this.dosificadorService.deleteDosificador(doser.ID)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          const f = this.table.data.findIndex(item => {
            return doser.ID === item.ID;
          });
          this.dosificadores = this.dosificadores.filter(p => p.ID !== doser.ID);
          this.table.data.splice(f, 1);
          this.table.data = cloneDeep(this.table.data);
          Swal.fire('¡Borrado!', `Disificador ${doser.ID} eliminado`, 'success');

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
