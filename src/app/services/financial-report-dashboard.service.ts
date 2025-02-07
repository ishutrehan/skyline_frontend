import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinancialReportDashboardService {

  baseUrl:string = environment.production
  constructor(private http:HttpClient) { }
  monthlyRevenue(){
    return this.http.get(`${this.baseUrl}/api/monthlyFinancialReportDashboard`)
  }

  annualRevenue(){
    return this.http.get(`${this.baseUrl}/api/annualFinancialReportDashboard`)
  }
}
