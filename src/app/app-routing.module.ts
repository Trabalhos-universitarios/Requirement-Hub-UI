import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./core/home/home.component";
import { LoginComponent } from './auth/components/login/login.component';
import { authGuard } from './auth/guard/auth.guard';
import { ProjectDashboardComponent } from './core/project-dashboard/project-dashboard.component';
import { ApprovalFlowComponent } from './core/approval-flow/approval-flow.component';
import { KanbanComponent } from './core/kanban/kanban.component';


const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [authGuard]},
  { path: 'project-dashboard', component: ProjectDashboardComponent, canActivate: [authGuard] },
  { path: 'approval-flow', component: ApprovalFlowComponent, canActivate: [authGuard] },
  { path: 'kanban', component: KanbanComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
