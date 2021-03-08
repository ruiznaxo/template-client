import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITable } from 'src/app/shared/components/table/table';
import { TableCallbackInjectable } from 'src/app/shared/components/table/table-injectable';
import Swal from 'sweetalert2';
import { Jaula } from '../../alimentar/alimentar';
import { AlimentarService } from '../../alimentar/alimentar.service';
import { JaulaService } from './jaula.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-jaula',
  templateUrl: './jaula.component.html',
  styleUrls: ['./jaula.component.scss']
})
export class JaulaComponent extends TableCallbackInjectable implements OnInit {

  @ViewChild('scrollDataModal') popup: ElementRef;

  //propositos de Template
  breadCrumbItems: Array<{}>;

  table: ITable = {
    title: "Lista Jaulas",
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
      }
    ],
    columns: [
      {
        name: "Nombre",
        prop: "NOMBRE",
        type: "text",
        sort: true
      },
      {
        name: "Programación",
        prop: "IDPROGRAMACION",
        type: "text"
      },
      {
        name: "Cantidad Peces",
        prop: "CANTIDADPECES",
        type: "text",
        sort: true
      },
      {
        name: "Peso Promedio",
        prop: "PESOPROMEDIO",
        type: "text",
        sort: true
      },
      {
        name: "Selectora",
        prop: "IDSELECTORA",
        type: "text"
      },
      {
        name: "Dosificador",
        prop: "IDDOSIFICADOR",
        type: "text"
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
  jaulas: Jaula[]

  //Objeto para editar
  editJaula: Jaula;
  
  //popups
  confirmPopup : boolean = false;


  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();

  constructor(
    public jaulaService: JaulaService,
    public modalService: NgbModal, 
    private alimentarService: AlimentarService
    ) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Jaulas', active: true }];

    this.loadData()
  }

  loadData() {

    let listaPeticionesHttp = [
      this.jaulaService.getJaulas(),
      this.alimentarService.getLineas()
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([jaulas, lineas]) => {

        jaulas.map(j => j.nombreLinea = this.alimentarService.getNombre(lineas, j.IDLINEA, "NOMBRE"))

        this.jaulas = jaulas
        this.table.data = this.jaulas
        this.table.auxData = this.jaulas
      });
  }

  setDisabledField(doser){
    if(this.jaulas.find(j => j.IDDOSIFICADOR === doser.ID)){      
      return true
    }
    return false;
  }

  openSavePopUp(){
    this.editJaula = undefined
    this.modalService.open(this.popup, { size: 'lg', scrollable: true, centered: true, backdrop: "static" })
  }

  openEditPopUp(data){
    this.editJaula = data;    
    this.modalService.open(this.popup, { size: 'lg', scrollable: true, centered: true, backdrop: "static" })
  }


  openDeleteConfirm(jaula: Jaula){
    this.confirmPopup = true
    Swal.fire({
      title: `¿Eliminar Jaula ${jaula.ID}?`,
      text: '¡Esto no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#556ee6',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {

        this.jaulaService.deleteJaula(jaula.ID)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((res) => {
          const f = this.table.data.findIndex(item => {
            return jaula.ID === item.ID;
          });
          this.jaulas = this.jaulas.filter(p => p.ID !== jaula.ID);
          this.table.data.splice(f, 1);
          this.table.data = cloneDeep(this.table.data);
          Swal.fire('¡Borrado!', `Jaula ${jaula.ID} eliminada`, 'success');

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
