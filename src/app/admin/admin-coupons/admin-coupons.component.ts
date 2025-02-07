import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-coupons',
  templateUrl: './admin-coupons.component.html',
  styleUrls: ['./admin-coupons.component.css'],
})
export class AdminCouponsComponent implements OnInit {
  constructor(private toastr: ToastrService, private http: HttpClient) {}
  baseUrl: string = environment.production;
  CreateModal: boolean = false;
  Coupon = {
    name: '',
    off: '',
    Promotion_code: '',
    expiry: '',
  };
  allCoupons: any = [];
  allPromoCode: any = [];
  minDate: string = '';

  ngOnInit(): void {
    this.fetchPromoCode();
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Add 1 since months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');

    this.minDate = `${year}-${month}-${day}`; // Format as yyyy-MM-dd
    this.Coupon = {
      name: '',
      off: '',
      Promotion_code: '',
      expiry: '',
    };
  }

  toggleModalOpen() {
    this.CreateModal = true;
  }
  fetchCoupons() {
    this.http
      .get<any>(`${this.baseUrl}/api/getAllCoupons`)
      .subscribe((res: any) => {
        console.log(res, 'response');
        if (res.coupons.data === null) {
        }
        this.allCoupons = res.coupons.data;
      });
  }
  fetchPromoCode() {
    this.http
      .get<any>(`${this.baseUrl}/api/getAllPromoCodes`)
      .subscribe((res: any) => {
        console.log(res.promotionCodes.data, 'promocod3e');
        if (res.promotionCodes.data === null) {
        }
        this.allPromoCode = res.promotionCodes.data.filter(
          (item: any) => item.active == true
        );
        console.log(this.allPromoCode, 'checktihsohdg hhdgui');
      });
  }
  cancleButton() {
    this.Coupon = {
      name: '',
      off: '',
      Promotion_code: '',
      expiry: '',
    };
    this.CreateModal = false;
  }
  createCoupon() {
    if (
      this.Coupon.name &&
      this.Coupon.off &&
      this.Coupon.expiry &&
      this.Coupon.Promotion_code
    ) {
      this.http
        .post<any>(`${this.baseUrl}/api/createCoupon`, {
          id: this.Coupon.name,
          expireDate: this.Coupon.expiry,
          percentageOff: this.Coupon.off,
          promotioncode: this.Coupon.Promotion_code,
        })
        .subscribe({
          next: (res: any) => {
            this.CreateModal = false;
            this.toastr.success('Coupon Created successfully');
            this.Coupon = {
              name: '',
              off: '',
              Promotion_code: '',
              expiry: '',
            };
            this.fetchPromoCode();
          },
          error: (err) => {
            this.toastr.error(err);
          },
        });
    } else {
      this.toastr.warning('Fill all the Fields Carefully');
    }
    this.fetchPromoCode();
  }
  deleteCoupon(coupon: any) {
    this.http
      .delete<any>(`${this.baseUrl}/api/deleteCoupon?couponCode=${coupon}`)
      .subscribe((res: any) => {
        console.log(res, 'response');
        this.fetchPromoCode();
        this.toastr.success('Coupon Code Deleted Successfully');
      });
  }
  getFormattedDate(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();

    return `${month}/${day}/${year}`; // Format as MM/dd/yyyy
  }
  transformToUppercase(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.toUpperCase();
    this.Coupon.Promotion_code = inputElement.value; // Update the model
  }
}
