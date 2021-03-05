import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ProgramacionComponent } from './programacion/programacion.component';
import { SharedModule } from '../../shared/shared.module';
import { LineaComponent } from './linea/linea.component';
import { SiloComponent } from './silo/silo.component';
import { JaulaComponent } from './jaula/jaula.component';
import { DosificadorComponent } from './dosificador/dosificador.component';
import { UserComponent } from './user/user.component';
import { ProgramacionEditComponent } from './programacion/programacion-edit/programacion-edit.component';
import { SiloPopupComponent } from './silo/silo-popup/silo-popup.component';
import { LineaPopupComponent } from './linea/linea-popup/linea-popup.component';
import { DosificadorPopupComponent } from './dosificador/dosificador-popup/dosificador-popup.component';
import { JaulaPopupComponent } from './jaula/jaula-popup/jaula-popup.component';

@NgModule({
  declarations: [ProgramacionComponent, LineaComponent, SiloComponent, JaulaComponent, DosificadorComponent, UserComponent, ProgramacionEditComponent, SiloPopupComponent, LineaPopupComponent, DosificadorPopupComponent, JaulaPopupComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
