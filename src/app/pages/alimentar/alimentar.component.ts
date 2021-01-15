import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alimentar',
  templateUrl: './alimentar.component.html',
  styleUrls: ['./alimentar.component.scss']
})
export class AlimentarComponent implements OnInit {

  breadCrumbItems: Array<{}>;

  constructor() { }

  ngOnInit(): void {

    this.breadCrumbItems = [{ label: 'Dashboard' }, { label: 'Alimentar', active: true }];

  }

}
