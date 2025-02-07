import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  tickframeSrc: string = 'assets/image/Frame 427323366.png';

  baseUrl:string = environment.production
  constructor(private http:HttpClient){}
  ngOnInit(): void {
    const sessionId = sessionStorage.getItem('sessionId');
    var userInfo:any = localStorage.getItem('userInfo')
    userInfo = JSON.parse(userInfo)
    this.http.post(`${this.baseUrl}/api/check-payment-status`,{sessionId,userId:userInfo?.userId}).subscribe((res:any)=>{
       console.log(res,"res data")
    })
  }

}
