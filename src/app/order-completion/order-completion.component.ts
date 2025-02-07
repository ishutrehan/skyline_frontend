import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-completion',
  templateUrl: './order-completion.component.html',
  styleUrls: ['./order-completion.component.css']
})
export class OrderCompletionComponent implements OnInit {
  
  firstname: string = '';
  lastname: string = '';
  email: string = '';
  feedback: string = '';
  orderId: any = null;
  baseUrl: string = environment.production;
  isLoading: boolean = false;

  ngOnInit(): void {

    let userinfo = localStorage.getItem('userInfo');
    if(userinfo){
    let formatted_data = JSON.parse(userinfo)
    this.firstname = formatted_data.name
    this.lastname = formatted_data.lastname
    this.email = formatted_data.email
    
    }
  }

  tickframeSrc: string = 'assets/image/Frame 427323366.png';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  handleSubmit() {
    this.isLoading = true;

    if (!this.firstname || !this.lastname || !this.email || !this.feedback) {
      this.toastr.warning('Please fill in all fields');
      return;
    }
    // console.log('Your first name is', this.firstname);
    // console.log('Your last name is', this.lastname);
    // console.log('Your email is', this.email);
    // console.log('Your feedback is', this.feedback);

    this.orderId = this.route.snapshot.paramMap.get('id');

    this.http
      .post<any>(`${this.baseUrl}/api/orderReview`, {
        orderId: this.orderId,
        firstName: this.firstname,
        lastName: this.lastname,
        email: this.email,
        feedbackMessage: this.feedback,
      })
      .subscribe({
        next: (response: any) => {
          console.log(response, 'feedback response');
          this.toastr.success('feedback submitted successfully');
          this.router.navigate(['/user/dashboard']);
          this.isLoading = false;
        },
        error: (error: any) => {
          this.toastr.error('feedback did not submitted');
          this.isLoading = false;
        },
      });
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.feedback = '';
  }

}
