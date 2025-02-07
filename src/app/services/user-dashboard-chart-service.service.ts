import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserDashboardChartServiceService {
  baseUrl: string = environment.production;
  constructor(private http: HttpClient) {}
  userDetails: any = localStorage.getItem('userInfo');
  userInfo: any = JSON.parse(this.userDetails);
  proofReadingEditingChart() {
    console.log(this.userInfo.userId);
    return this.http.get(
      `${this.baseUrl}/api/users/proofreadingChart/${this.userInfo.userId}`
    );
  }
  assignmentChart() {
    console.log(this.userInfo.userId);

    return this.http.get(
      `${this.baseUrl}/api/users/assignmentChart/${this.userInfo.userId}`
    );
  }
}
