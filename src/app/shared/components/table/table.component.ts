import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Observable } from 'rxjs';

import { ITable } from './table';

import { TableService } from './table.service';
import { AdvancedSortableDirective, SortEvent } from './advanced-sortable.directive';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [TableService, DecimalPipe]
})

/**
 * Advanced table component
 */
export class TableComponent implements OnInit, OnChanges {
  // bread crum data
  breadCrumbItems: Array<{}>;
  // Table data

  public selected: any;


  tables$: Observable<any[]>;
  total$: Observable<number>;

  auxData = []

  @Input() table: ITable;
  @Output() clickButton = new EventEmitter<any>();

  @ViewChildren(AdvancedSortableDirective) headers: QueryList<AdvancedSortableDirective>;

  constructor(public service: TableService) {
    
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Tables' }, { label: 'Advanced Table', active: true }];
    this.service.setTableData(this.table.data)
    //Setear deta en servicio
    this.tables$ = this.service.tables$;
    this.total$ = this.service.total$;

    this.auxData = [...this.table.data];
        
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.table && this.table) {
      this.auxData = [...this.table.data];
    }
  }
 

  onSelectRed(row) {
    console.log(row);
  }

  onSelectBlue(value) {
    console.log(value);
  }

  /**
   * Sort table data
   * @param param0 sort the column
   *
   */
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  click(event) {
    if (event && event.clientX !== 0 && event.clientY !== 0) {
      this.clickButton.emit(event);
    }
  }

  updateFilter(event) {
    const val:string = event.target.value.toLowerCase();

    let filtered = []

    filtered = this.table.data.filter((obj) => {
      return Object.keys(obj).reduce((acc, curr) => {
        return acc || obj[curr].toString().toLowerCase().includes(val);
      }, false);
    }) 

    val ? this.table.data = filtered : this.table.data = this.table.auxData

  }
}
