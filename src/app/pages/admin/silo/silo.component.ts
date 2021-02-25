import { Component, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { ITable } from 'src/app/shared/components/table/table';
import { TableCallbackInjectable } from 'src/app/shared/components/table/table-injectable';
import { Linea, Silo } from '../../alimentar/alimentar';
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
  lineas: Linea[]

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();


  constructor(public alimentarService: AlimentarService, public siloService: SiloService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Silos', active: true }];

    this.loadData()
  }

  loadData() {

    let listaPeticionesHttp = [
      this.alimentarService.getLineas(),
      this.siloService.getSilos()
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([lineas, silos]) => {
        this.lineas = lineas
        silos.map(s => s.)
        silos.map(p => p.disableDelete = this.setDisabledField(p))
        this.silos = silos;
        this.table.data = this.silos
        this.table.auxData = this.silos
      });
  }

  setDisabledField(silo) {
    if (this.lineas.find(l => l.ID === silo.ID)) {
      return true
    }
    return false;
  }

}
