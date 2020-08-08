import {Routes} from '@angular/router';
import {MainComponent} from './main.component';
import { HomeComponent } from './home/home.component';


export const mainRoutes: Routes =[
    {path:'',component: MainComponent, children:[
        {path:'', redirectTo:'home',pathMatch:'full'},
        // {path:'home', component:HomeComponent},
        {path:'home',loadChildren:'./home/home.module#HomeModule'},
        {path:'user',loadChildren:'./user/user.module#UserModule'},
        {path:'role', loadChildren:'./role/role.module#RoleModule'},
        {path:'function', loadChildren:'./function/function.module#FunctionModule'},
        {path:'product-category', loadChildren:'./product-category/product-category.module#ProductCategoryModule'},
        {path:'product',loadChildren:'./product/product.module#ProductModule'},
        {path:'bill',loadChildren:'./bill/bill.module#BillModule'},
    ]}
]