import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentTransactionService {
  baseUrl: string = environment.production;
  currentPage: number = 1;
  constructor(private http: HttpClient) {}

  setTransaction(
    userId:number,
    userName:string,
    email:string,
    workType: string,
    amountPaid: number,
    creditPaid: number
  ) {
    return this.http.post(`${this.baseUrl}/api/paymentTransaction`, {
      userId,
      userName,
      email,
      workType,
      amountPaid,
      creditPaid,
    });
  }
  showAllTheTransactions(pageNo:any) {
    return this.http.get(`${this.baseUrl}/api/showAllPayments`, {
      params: pageNo,
    });
  }
}
