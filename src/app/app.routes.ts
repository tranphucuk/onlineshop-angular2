import { Routes } from '@angular/router';
export const appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    // { path: 'login', loadChildren: 'src/app/login/login.module#LoginModule'},
    { path: 'login', loadChildren: () => import('src/app/login/login.module').then(m => m.LoginModule) },
    { path: 'main', loadChildren: () => import('src/app/main/main.module').then(n => n.MainModule) },
    // { path: 'main', loadChildren: './main/main.module#MainModule' }
]