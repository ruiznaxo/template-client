import { Component, OnInit, ViewChildren, QueryList, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DecimalPipe } from '@angular/common';


import { Button, ITable } from './table';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [DecimalPipe]
})

/**
 * Advanced table component
 */
export class TableComponent implements OnInit, OnChanges {
  // bread crum data
  breadCrumbItems: Array<{}>;
  // Table data

  public selected: any;

  auxData = []

  @Input() table: ITable;
  @Output() clickButton = new EventEmitter();


  constructor() {

  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Tables' }, { label: 'Advanced Table', active: true }];
    this.auxData = [...this.table.data];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.table && this.table) {
      this.auxData = [...this.table.data];
    }
  }


  callBackClick(event, button: Button, data?) {       
    this.clickButton.emit({ functionCallBack: button.event, data: data });

  }


  updateFilter(event) {
    const val: string = event.target.value.toLowerCase();

    let filtered = []

    filtered = this.table.data.filter((obj) => {
      return Object.keys(obj).reduce((acc, curr) => {
        return acc || obj[curr].toString().toLowerCase().includes(val);
      }, false);
    })

    val ? this.table.data = filtered : this.table.data = this.table.auxData

  }
}
