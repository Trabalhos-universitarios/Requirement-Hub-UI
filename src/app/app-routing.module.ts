import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/home/home.component";
import { MatrixComponent } from './core/matrix/matrix.component';

const routes: Routes = [
  {path: '', component: HomeComponent},{path: 'home', component: HomeComponent}, {path: 'traceability', component: MatrixComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
