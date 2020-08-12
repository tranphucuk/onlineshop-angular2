import { Routes, RouterModule } from '@angular/router'
import { AnnouncementComponent } from '../announcement/announcement.component'

const routes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' },
    { path: 'index', component: AnnouncementComponent }
]

export const AnnouncementRoute = RouterModule.forChild(routes)