import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDetailsService {

  baseUrl:string=environment.production
  userDetails:any=localStorage.getItem('userInfo');
  userInfo:any = JSON.parse(this.userDetails);
   constructor(private http:HttpClient) { }
   getRunningSubPlan(){
      return this.http.get(`${this.baseUrl}/api/check-subscription-plan/${this.userInfo.userId}`)
   }

   getcurrentPlanFeatures(){
    return this.http.get(`${this.baseUrl}/api/currentPlanIncludes/${this.userInfo.userId}`)
   }

  //update credits
  updateCredits(noOfWords: number){
    return this.http.post(`${this.baseUrl}/api/updateCredits`,{noOfWords,userId:this.userInfo.userId})
  }
}
