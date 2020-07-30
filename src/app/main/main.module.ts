import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { mainRoutes } from './main.routes';
import { Routes, RouterModule } from '@angular/router';
import { UserModule } from './user/user.module'
import { HomeModule } from './home/home.module'
import { UtilityService } from '../../app/core/services/utility.service';
import { AuthenService } from '../core/services/authen.service';
import { HttpModule } from '@angular/http'
import { RoleModule } from './role/role.module';
import { DataService } from '../core/services/data.service';
import {MessageConstants} from '../core/services/common/message.constant';
import {FunctionModule} from '../../app/main/function/function.module'
import {SidebarMenuComponent} from '../../app/shared/sidebar/sidebar-menu/sidebar-menu.component'
import {TopbarMenuComponent} from '../shared/topbar/topbar-menu/topbar-menu.component'


@NgModule({
  declarations: [MainComponent, SidebarMenuComponent, TopbarMenuComponent],
  providers: [UtilityService, AuthenService, DataService, MessageConstants],
  imports: [
    CommonModule,
    UserModule,
    HomeModule,
    HttpModule,
    RoleModule,
    FunctionModule,
    RouterModule.forChild(mainRoutes)
  ]
})
export class MainModule { }
