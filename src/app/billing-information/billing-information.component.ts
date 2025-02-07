import { HttpClient } from '@angular/common/http';
import { Component, OnInit , ViewEncapsulation} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-billing-information',
  templateUrl: './billing-information.component.html',
  styleUrls: ['./billing-information.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BillingInformationComponent implements OnInit {
userDetails:any = localStorage.getItem('userInfo');
userInfo = JSON.parse(this.userDetails);
baseUrl = environment.production;
avatarAlt: string = 'Avatar';
cs0Src: string = 'assets/image/arrow-left.png';
cs1Src: string = 'assets/image/tick-circle.png';
options = { day: '2-digit', month: 'short', year: 'numeric' };
nextPayment:any=''
startDate:any=''
subscriptionDetails:any=null
  constructor(private http:HttpClient,private toastr:ToastrService) { }

  ngOnInit(): void {
       this.http.get(`${this.baseUrl}/api/check-subscription-plan/${this.userInfo.userId}`).subscribe({
        next:(res:any)=>{
          this.subscriptionDetails = res;
          const date12:any = new Date(res.endDate);
          const date13:any = new Date(res.startDate);
          console.log(res,"res data")
          this.nextPayment=date12.toLocaleDateString('en-GB',this.options);
          this.startDate =date13.toLocaleDateString('en-GB',this.options);
        },
        error:(err:any)=>{
          console.log(err)
        }
       })
  }
  Subscription: string = '';
  showModal1: boolean = false;

  onSelectionChange(selectedValue: string) {
    if (selectedValue === 'Cancel Subscription') {
      // Show the modal
      this.showModal1 = true;
    }

  }

  toggleModal1() {
    this.showModal1 = !this.showModal1;
  }

  deleteSubscription() {

    this.http.delete(`${this.baseUrl}/api/cancleSubcription/${this.userInfo.userId}`).subscribe({
      next:(data:any)=>{
        this.toastr.success('Delete subscription')
        console.log(data,"data deleted")
      },
      error:(err:any)=>{
        console.log(err);
      }
    })
    this.showModal1 = false; 
  }
  
  Canceledcancellation() {
    console.log('Canceled cancellation.');
    this.showModal1 = false; 
  }

  items= [
    { paidfor: 'Plagiarism & AI Content Detector-Copyleaks AI Content & Plagiarism Detector 100 Monthly Credits ', date: this.startDate, paid: this.subscriptionDetails?.amount, export: 'Export' },
    // { paidfor: 'Plagiarism & AI Content Detector-Copyleaks AI Content & Plagiarism Detector 100 Monthly Credits ', date: 'Feb 21, 2024', paid: '$16.11', export: 'Export' },
    // { paidfor: 'Plagiarism & AI Content Detector-Copyleaks AI Content & Plagiarism Detector 100 Monthly Credits ', date: 'Mar 21, 2024', paid: '$12.11', export: 'Export' },
    // { paidfor: 'Plagiarism & AI Content Detector-Copyleaks AI Content & Plagiarism Detector 100 Monthly Credits ', date: 'May 21, 2024', paid: '$10.11', export: 'Export' },
  ];

  creditSrc: string = 'assets/image/Group.png';
}
