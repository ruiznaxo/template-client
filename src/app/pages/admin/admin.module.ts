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

@NgModule({
  declarations: [ProgramacionComponent, LineaComponent, SiloComponent, JaulaComponent, DosificadorComponent, UserComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
