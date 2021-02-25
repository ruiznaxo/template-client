import { Component, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITable } from 'src/app/shared/components/table/table';
import { TableCallbackInjectable } from 'src/app/shared/components/table/table-injectable';
import { Dosificador } from '../../alimentar/alimentar';
import { DosificadorService } from '../dosificador/dosificador.service';

@Component({
  selector: 'app-dosificador',
  templateUrl: './dosificador.component.html',
  styleUrls: ['./dosificador.component.scss']
})
export class DosificadorComponent extends TableCallbackInjectable implements OnInit {

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
        name: "Dosificador",
        prop: "ID",
        type: "text"
      },
      {
        name: "Prioridad",
        prop: "PRIORIDAD",
        type: "text"
      },
      {
        name: "Modelo Reductor",
        prop: "MODELOREDUCTOR",
        type: "text"
      },
      {
        name: "Tasamax",
        prop: "TASAMAX",
        type: "decimal"
      },
      {
        name: "Silo",
        prop: "IDSILO",
        type: "text"
      },
      {
        name: "Linea",
        prop: "IDLINEA",
        type: "text"
      }
    ],
    data: [],
    auxData: [],
    searchable: true

  }

  dosificadores: Dosificador[]

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();


  constructor(public dosificadorService: DosificadorService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Dosificadors', active: true }];

    this.loadData()
  }

  loadData() {

    let listaPeticionesHttp = [
      this.dosificadorService.getDosificadores()
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([dosificadores]) => {
        this.dosificadores = dosificadores
        this.table.data = this.dosificadores
        this.table.auxData = this.dosificadores
      });
  }

  setDisabledField(jaula) {
    if (this.dosificadores.find(l => l.ID === jaula.ID)) {
      return true
    }
    return false;
  }

}
