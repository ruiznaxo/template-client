import { Component, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITable } from 'src/app/shared/components/table/table';
import { TableCallbackInjectable } from 'src/app/shared/components/table/table-injectable';
import { Linea } from '../../alimentar/alimentar';
import { LineaService } from './linea.service';

@Component({
  selector: 'app-linea',
  templateUrl: './linea.component.html',
  styleUrls: ['./linea.component.scss']
})
export class LineaComponent extends TableCallbackInjectable implements OnInit {

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
        name: "Programación",
        prop: "IDPROGRAMACION",
        type: "text"
      }
    ],
    data: [],
    auxData: [],
    searchable: true

  }

  lineas: Linea[]

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();


  constructor(public lineaService: LineaService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Lineas', active: true }];

    this.loadData()
  }

  loadData() {

    let listaPeticionesHttp = [
      this.lineaService.getLineas()
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([lineas]) => {
        this.lineas = lineas
        this.table.data = this.lineas
        this.table.auxData = this.lineas
      });
  }

  setDisabledField(silo) {
    if (this.lineas.find(l => l.ID === silo.ID)) {
      return true
    }
    return false;
  }

}
