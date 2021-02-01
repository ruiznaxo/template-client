import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';

import { NgxSliderModule } from "@angular-slider/ngx-slider";
import { AlimentacionFilterbyJaulaPipe } from './pipes/alimentacion-filterby-jaula.pipe';
import { JaulaFilterbyLineaPipe } from './pipes/jaula-filterby-linea.pipe';
import { AlarmaFilterbyLineaPipe } from './pipes/alarmas-filterby-linea.pipe';

@NgModule({
  declarations: [AlimentacionFilterbyJaulaPipe, JaulaFilterbyLineaPipe, AlarmaFilterbyLineaPipe],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule,
    NgxSliderModule
  ],
  exports:[
    NgxSliderModule,
    AlimentacionFilterbyJaulaPipe, 
    JaulaFilterbyLineaPipe,
    AlarmaFilterbyLineaPipe
  ]
})

export class SharedModule { }
