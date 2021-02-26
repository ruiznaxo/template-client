import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ITable } from 'src/app/shared/components/table/table';
import { TableCallbackInjectable } from 'src/app/shared/components/table/table-injectable';
import { Dosificador, Silo } from '../../alimentar/alimentar';
import { AlimentarService } from '../../alimentar/alimentar.service';
import { SiloService } from './silo.service';

@Component({
  selector: 'app-silo',
  templateUrl: './silo.component.html',
  styleUrls: ['./silo.component.scss']
})
export class SiloComponent extends TableCallbackInjectable implements OnInit {

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
          event: "openEditPopup",
        },
        {
          icon: "trash",
          tooltip: "Eliminar",
          disabledTooltip: "Silo en uso",
          event: "openConfirmPopup",
          fieldDisabledValue: "disableDelete"
        }
      ]
    },
    buttons: [
      {
        event: "openPopUp",
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
        name: "Capacidad",
        prop: "CAPACIDAD",
        type: "decimal"
      },
      {
        name: "Medicado",
        prop: "MEDICADO",
      },
      {
        name: "Saldo",
        prop: "SALDO",
        type: "decimal"
      },
      {
        name: "Pellet Kilo",
        prop: "PELLETKILO",
        type: "decimal"
      },
      {
        name: "Alimento",
        prop: "ALIMENTO",
        type: "text"
      },
    ],
    data: [],
    auxData: [],
    searchable: true

  }

  silos: Silo[]
  dosificadores: Dosificador[]

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();


  constructor(public alimentarService: AlimentarService, public siloService: SiloService, public modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Silos', active: true }];

    this.loadData()
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

  openPopUp(){
    this.modalService.open(this.popup, { size: 'lg', scrollable: true, centered: true, backdrop: "static" })
  }

}
