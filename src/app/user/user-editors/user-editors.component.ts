import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-editors',
  templateUrl: './user-editors.component.html',
  styleUrls: ['./user-editors.component.css']
})
export class UserEditorsComponent implements OnInit {

  items2: any[] = [];
  visibleItems2: any[] = [];
  baseUrl:string = environment.production

  constructor(private http: HttpClient) {}
  isLoading: boolean = false;
  ngOnInit(): void {
    this.isLoading = true
    // Make HTTP GET request to your API
    this.http
      .get<any>(`${this.baseUrl}/api/showEditors`)
      .subscribe((res: any) => {
        console.log(res.ediotrs,"editors")
        this.items2 = res.editors;
        this.updateVisibleItems2();
        this.isLoading = false

      });
  }

  showAll1(): void {
    console.log('showAll() function called');

    this.visibleItems2 = this.items2;
  }

  private updateVisibleItems2(): void {
    this.visibleItems2 = this.items2.slice(0, 5);
  }
}

