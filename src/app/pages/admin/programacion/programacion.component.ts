import { Component, OnInit } from '@angular/core';
import { ITable } from '../../../shared/components/table/table';

@Component({
  selector: 'app-programacion',
  templateUrl: './programacion.component.html',
  styleUrls: ['./programacion.component.scss']
})
export class ProgramacionComponent implements OnInit {

  table: ITable = {
    title: "Title Test",
    subtitle: "Subtitle Test",
    actionsColumn: {
      active: false
    },
    columns: [
      {
        title: "Nombre",
        data: "nombre",
      },
      {
        title: "Apellido",
        data: "apellido",
      }
    ],
    data: [
      {
        nombre: "Ignacio",
        apellido: "Ruiz"
      },
      {
        nombre: "Martin",
        apellido: "Ruiz"
      },
    ],
    searchable: true

  }
 

  constructor() { }

  ngOnInit(): void {
  }

}
