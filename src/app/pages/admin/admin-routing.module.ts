import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramacionComponent } from './programacion/programacion.component';
import { LineaComponent } from './linea/linea.component';
import { UserComponent } from './user/user.component';
import { JaulaComponent } from './jaula/jaula.component';
import { SiloComponent } from './silo/silo.component';
import { DosificadorComponent } from './dosificador/dosificador.component';

const routes: Routes = [
  { path: 'programacion', component: ProgramacionComponent },
  { path: 'linea', component: LineaComponent },
  { path: 'user', component: UserComponent },
  { path: 'jaula', component: JaulaComponent },
  { path: 'silo', component: SiloComponent },
  { path: 'dosificador', component: DosificadorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
