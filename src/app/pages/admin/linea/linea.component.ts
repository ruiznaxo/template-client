import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITable } from 'src/app/shared/components/table/table';
import { TableCallbackInjectable } from 'src/app/shared/components/table/table-injectable';
import Swal from 'sweetalert2';
import { Jaula, Linea, Programacion } from '../../alimentar/alimentar';
import { AlimentarService } from '../../alimentar/alimentar.service';
import { LineaService } from './linea.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.scss']
})
export class LineaComponent extends TableCallbackInjectable implements OnInit, OnDestroy {

  @ViewChild('scrollDataModal') popup: ElementRef;

  //propositos de Template
  breadCrumbItems: Array<{}>;

  table: ITable = {
    title: "Lista Lineas",
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
          disabledTooltip: "Linea en uso",
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
        name: "Programación",
        prop: "IDPROGRAMACION",
        type: "text",
        showedName: "nombreProgramacion"
      }
    ],
    data: [],
    auxData: [],
    searchable: true

  }

  //Arrays de Objetos
  lineas: Linea[]
  jaulas: Jaula[]
  programaciones: Programacion[]

  //Objeto para editar
  editLinea: Linea;

  //popups
  confirmPopup: boolean = false;

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();


  constructor(
    public lineaService: LineaService,
    public modalService: NgbModal,
    private alimentarService: AlimentarService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Lineas', active: true }];
    this.loadData()
  }

  //para cerrar las subscripciones
  ngOnDestroy() {
    //cancelar suscripciones
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


  loadData() {

    let listaPeticionesHttp = [
      this.lineaService.getLineas(),
      this.alimentarService.getJaulas(),
      this.alimentarService.getProgramaciones()
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([lineas, jaulas, programaciones]) => {
        this.jaulas = jaulas;
        this.programaciones = programaciones

        console.log(lineas.map(a => a.IDPROGRAMACION));
        console.log(programaciones)
        lineas.map(l => l.disableDelete = this.setDisabledField(l))
        lineas.map(l => l.nombreProgramacion = this.alimentarService.getNombre(programaciones, l.IDPROGRAMACION, "NOMBRE"))
        this.lineas = lineas;

        
        this.table.data = this.lineas;
        this.table.auxData = this.lineas;
      });
  }

  setDisabledField(linea) {
    if (this.jaulas.find(j => j.IDLINEA === linea.ID)) {
      return true
    }
    return false;
  }

  openSavePopUp() {
    this.editLinea = undefined
    this.modalService.open(this.popup, { size: 'sm', centered: true, backdrop: "static" })
  }

  openEditPopUp(data) {
    this.editLinea = data;
    this.modalService.open(this.popup, { size: 'sm', centered: true, backdrop: "static" })
  }


  openDeleteConfirm(linea: Linea) {
    this.confirmPopup = true
    Swal.fire({
      title: `¿Eliminar Linea ${linea.NOMBRE}?`,
      text: '¡Esto no se puede revertir!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#556ee6',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {

        this.lineaService.deleteLinea(linea.ID)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe((res) => {
            const f = this.table.data.findIndex(item => {
              return linea.ID === item.ID;
            });
            this.lineas = this.lineas.filter(p => p.ID !== linea.ID);
            this.table.data.splice(f, 1);
            this.table.data = cloneDeep(this.table.data);
            Swal.fire('¡Borrado!', `Linea ${linea.NOMBRE} eliminada`, 'success');

            (err) => console.log(err)

            //this.loadData;      
          })

      }
    });
  }

  aceptarPopupClick(event) {
    this.loadData()
    this.table.data = cloneDeep(this.table.data);
  }

  getNombreProgramacion(idProgramacion): string{
    return this.programaciones.find(p => p.ID === idProgramacion).NOMBRE
  }

}
