import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModule } from './ui/ui.module';

import { WidgetModule } from './widget/widget.module';

import { NgxSliderModule } from "@angular-slider/ngx-slider";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    UIModule,
    WidgetModule,
    NgxSliderModule
  ],
  exports:[
    NgxSliderModule
  ]
})

export class SharedModule { }
