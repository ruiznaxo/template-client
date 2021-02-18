import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ITable } from '../../../shared/components/table/table';
import { ProgramacionService } from './programacion.service';
import { Programacion } from '../../alimentar/alimentar';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.scss']
})
export class ProgramacionComponent implements OnInit {

  table: ITable = {
    title: "Lista Programaciones",
    actionsColumn: {
      active: true,
      buttons: [
        {
          icon: "edit-alt",
          tooltip: "Editar",
        },
        {
          icon: "trash",
          tooltip: "Eliminar",
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

  //propositos de Template
  breadCrumbItems: Array<{}>;

  //utilizada para cerrar subscripciones
  private unsubscribe = new Subject<void>();

  programaciones: Programacion[]

  constructor(private programacionService: ProgramacionService) { }

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

  editProgramacion() {
    console.log("ID: ");

  }

}
