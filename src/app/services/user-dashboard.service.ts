import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {

  baseUrl:string = environment.production;
  constructor(private http:HttpClient) { }

  getUserDashboardDetails(userId:number)
  {
    return this.http.get(`${this.baseUrl}/api/getLastOrders`,{params:{id:userId}})
  }
}
