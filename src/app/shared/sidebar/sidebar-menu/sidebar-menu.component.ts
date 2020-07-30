import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service'

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {
  public functions: any[];
  constructor(private dataSer: DataService) { }

  ngOnInit(): void {
    this.dataSer.get('/api/function/getlisthierarchy').subscribe((res: any[]) => {
      this.functions = res.sort((n1, n2) => {
        return n1.DisplayOrder - n2.DisplayOrder;
      })
    }, err => {
      this.dataSer.handleError(err);
    })
  }

}
