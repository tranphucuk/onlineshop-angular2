import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service'

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  public pageIndex: number = 1;
  public pageSize: number =1;
  public pageDisplay: number = 10;
  public filter: string = '';
  public totalRow: number;
  public roles:any[];

  constructor(private dataSer: DataService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.dataSer.get('/api/appRole/getlistpaging?page=' + this.pageIndex + '&pageSize=' + this.pageSize + '&filter=' + this.filter + '').subscribe((res:any)=>{
      console.log(res);
      this.roles = res.Items;
      this.pageIndex = res.PageIndex;
      this.totalRow = res.TotalRows;
      this.pageSize = 1;
    });
  }

  pageChanged(event: any){
    this.pageIndex = event.page;
    this.loadData();
  }
}
