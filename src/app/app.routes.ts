import { Routes } from '@angular/router';
import { LoginComponent } from './authorize/login/login.component';
import { DashboardComponent } from './Paginas/dashboard/dashboard.component';
import { NotFoundComponent } from './componentes/not-found/not-found.component';
import { CrearsalidasComponent } from './Paginas/salidas/crearsalidas/crearsalidas.component';
import { ListadosalidasComponent } from './Paginas/salidas/listadosalidas/listadosalidas.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'registroSalidas', component: CrearsalidasComponent, canActivate: [AuthGuard] },
    { path: 'listadoSalidas', component: ListadosalidasComponent, canActivate: [AuthGuard] },
    { path: '**', component: NotFoundComponent },
];
