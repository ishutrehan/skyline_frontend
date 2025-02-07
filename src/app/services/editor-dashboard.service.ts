import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditorDashboardService {

  constructor(private http:HttpClient) { }
  baseUrl:string = environment.production
  getEditorsDashboardData(userId:number){
    return this.http.get(`${this.baseUrl}/api/showOrdersInEditorDashboard`,{params:{id:userId}});
  }
}
