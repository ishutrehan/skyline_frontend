import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardChartService {

  baseUrl: string = environment.production;
  constructor(private http: HttpClient) {}
  proofReadingEditingChart() {
    return this.http.get(
      `${this.baseUrl}/api/admin/chartForProofReadingDataAdmin`
    );
  }
  assignmentChart() {
    return this.http.get(
      `${this.baseUrl}/api/admin/chartForAssignmentDataAdmin`
    );
  }
}
