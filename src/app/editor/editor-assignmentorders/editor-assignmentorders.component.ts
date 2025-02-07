import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editor-assignmentorders',
  templateUrl: './editor-assignmentorders.component.html',
  styleUrls: ['./editor-assignmentorders.component.css']
})
export class EditorAssignmentordersComponent implements OnInit {

 
  items: any[] = [];
  typeOfuser: string = '';
  baseUrl: string = environment.production;
  constructor(private http: HttpClient) {}
  isLoading: boolean = false;
  //  userInfo:any = localStorage.getItem('userInfo');
  // // take it from localStorage
  // userId: Number = JSON.parse(this.userInfo);
  ngOnInit(): void {
    this.isLoading = true;

    let userInfo: any = localStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    this.typeOfuser = userInfo.accountType;
    // Make HTTP GET request to your API
    // geteditororders
    console.log(userInfo.accountType, 'userInfo.accountType');
    if (userInfo.accountType === 'user') {
      this.http
        .get<any>(`${this.baseUrl}/api/getorders/${userInfo.userId}`)
        .subscribe((res: any) => {
          // console.log(res, 'res');
          this.items = res.data;
          this.isLoading = false;

          // this.items = res.editors;
        });
    } else if (userInfo.accountType === 'editor') {
      this.http
        .get<any>(`${this.baseUrl}/api/getEditorAssignments/${userInfo.userId}`)
        .subscribe((res: any) => {
          console.log(res, 'res');
          this.items = res.data;
          this.isLoading = false;

          // this.items = res.editors;
        });
    } else {
      this.http
        .get<any>(`${this.baseUrl}/api/allOrders`)
        .subscribe((res: any) => {
          console.log(res, 'res');
          this.items = res.data;
          this.isLoading = false;

          // this.items = res.editors;
        });
    }
  }

  onClick() {
    this.isLoading = true;
  }
}
