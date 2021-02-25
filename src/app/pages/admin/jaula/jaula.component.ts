import { Component, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITable } from 'src/app/shared/components/table/table';
import { TableCallbackInjectable } from 'src/app/shared/components/table/table-injectable';
import { Jaula } from '../../alimentar/alimentar';
import { JaulaService } from './jaula.service';

@Component({
  selector: 'app-jaula',
  templateUrl: './jaula.component.html',
  styleUrls: ['./jaula.component.scss']
})
export class JaulaComponent extends TableCallbackInjectable implements OnInit {

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

  jaulas: Jaula[]

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();


  constructor(public jaulaService: JaulaService) {
    super();
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Admin' }, { label: 'Jaulas', active: true }];

    this.loadData()
  }

  loadData() {

    let listaPeticionesHttp = [
      this.jaulaService.getJaulas()
    ]

    forkJoin(listaPeticionesHttp).pipe(takeUntil(this.unsubscribe))
      .subscribe(([jaulas]) => {
        this.jaulas = jaulas
        this.table.data = this.jaulas
        this.table.auxData = this.jaulas
      });
  }

  setDisabledField(jaula) {
    if (this.jaulas.find(l => l.ID === jaula.ID)) {
      return true
    }
    return false;
  }

}
