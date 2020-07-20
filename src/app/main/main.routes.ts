import {Routes} from '@angular/router';
import {MainComponent} from './main.component';
import { HomeComponent } from './home/home.component';


export const mainRoutes: Routes =[
    {path:'',component: MainComponent, children:[
        {path:'', redirectTo:'home',pathMatch:'full'},
        // {path:'home', component:HomeComponent},
        {path:'home',loadChildren:'./home/home.module#HomeModule'},
        {path:'user',loadChildren:'./user/user.module#UserModule'},
        {path:'role', loadChildren:'./role/role.module#RoleModule'}
    ]}
]