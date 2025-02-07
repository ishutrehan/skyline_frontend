import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  baseUrl:string=environment.production
  constructor(private http:HttpClient) { 
    
  }
  getLastOrders(){
    return this.http.get(`${this.baseUrl}/api/showOrdersInAdminDashboard`);
  }
}
