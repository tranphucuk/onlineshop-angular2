import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnouncementComponent } from './announcement.component';
import {AnnouncementRoute} from './announcement.routes'
import { ModalModule } from 'ngx-bootstrap/modal';
import {FormsModule} from '@angular/forms'

@NgModule({
  declarations: [AnnouncementComponent],
  imports: [
    CommonModule,
    AnnouncementRoute,
    FormsModule,
    ModalModule.forRoot(),

  ]
})
export class AnnouncementModule { }
