import { Routes } from '@angular/router';
import { AuthGuards } from './core/services/guards/auth.guards';
// import{AuthGuards} from './core/services/guards/auth.guards'

export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // { path: 'login', loadChildren: 'src/app/login/login.module#LoginModule'},
    { path: 'login', loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule)},
    { path: 'main', loadChildren: () => import('src/app/main/main.module').then(n => n.MainModule),canActivate:[AuthGuards]},
    // { path: 'main', loadChildren: './main/main.module#MainModule' }
]