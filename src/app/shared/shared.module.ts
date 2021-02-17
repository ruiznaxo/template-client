import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';

import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { AlimentacionFilterbyJaulaPipe } from './pipes/alimentacion-filterby-jaula.pipe';
import { JaulaFilterbyLineaPipe } from './pipes/jaula-filterby-linea.pipe';
import { AlarmaFilterbyLineaPipe } from './pipes/alarmas-filterby-linea.pipe';
import { ButtonComponent } from './components/button/button.component';
import { PopupComponent } from './components/popup/popup.component';
import { TableComponent } from './components/table/table.component';
import { NgbCollapseModule, NgbDropdownModule, NgbPaginationModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { NumberPickerModule } from 'ng-number-picker';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

@NgModule({
  declarations: [
    AlimentacionFilterbyJaulaPipe, 
    JaulaFilterbyLineaPipe, 
    AlarmaFilterbyLineaPipe, 
    ButtonComponent, 
    PopupComponent, 
    TableComponent,
  ],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule,
    NgxSliderModule,
    NgbTooltipModule,
    NgSelectModule,
    FormsModule,
    NumberPickerModule,
    PerfectScrollbarModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
  ],
  exports:[
    NgxSliderModule,
    AlimentacionFilterbyJaulaPipe, 
    JaulaFilterbyLineaPipe,
    AlarmaFilterbyLineaPipe,
    ButtonComponent,
    PopupComponent,
    TableComponent,
    NgSelectModule,
    FormsModule,
    NumberPickerModule,
    PerfectScrollbarModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    NgbCollapseModule,
    NgbDropdownModule,
    UIModule
  ]
})

export class SharedModule { }
