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
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AlimentacionFilterbyJaulaPipe, JaulaFilterbyLineaPipe, AlarmaFilterbyLineaPipe, ButtonComponent, PopupComponent],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule,
    NgxSliderModule,
    NgbTooltipModule,
  ],
  exports:[
    NgxSliderModule,
    AlimentacionFilterbyJaulaPipe, 
    JaulaFilterbyLineaPipe,
    AlarmaFilterbyLineaPipe,
    ButtonComponent,
    PopupComponent
  ]
})

export class SharedModule { }
