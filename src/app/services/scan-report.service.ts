import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScanReportService {
  baseUrl: string = environment.production;
  constructor(private http: HttpClient) {}
  scanReport(userId:any) {
    return this.http.get(`${this.baseUrl}/api/scan/showscandata?userId=${userId}&search=&pageNo=1`)
  }
}
