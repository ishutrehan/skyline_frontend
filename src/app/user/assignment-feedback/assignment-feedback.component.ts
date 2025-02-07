import { HttpClient, HttpEventType } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentTransactionService } from 'src/app/services/payment-transaction.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription-details.service';
import { environment } from 'src/environments/environment';
import { UserGoogleCalenderComponent as calender } from '../user-google-calender/user-google-calender.component';

interface Country {
  code: string;
  flag: string;
  name: string;
}

@Component({
  selector: 'app-assignment-feedback',
  templateUrl: './assignment-feedback.component.html',
  styleUrls: ['./assignment-feedback.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AssignmentFeedbackComponent implements OnInit {
  @ViewChild(calender) showPrice!: calender;
  @ViewChild(calender) childComponent!: calender;

  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cal2Src: string = 'assets/image/cal.png';
  checkvalid: boolean = false;
  uploadMultipleFiles: File[] = [];
  current_day: string = '';
  countries: Country[] = [
    { code: '+1', flag: '🇺🇸', name: 'United States' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+91', flag: '🇮🇳', name: 'India' },
    { code: '+61', flag: '🇦🇺', name: 'Australia' },
    { code: '+81', flag: '🇯🇵', name: 'Japan' },
    { code: '+86', flag: '🇨🇳', name: 'China' },
    { code: '+33', flag: '🇫🇷', name: 'France' },
    { code: '+49', flag: '🇩🇪', name: 'Germany' },
    { code: '+39', flag: '🇮🇹', name: 'Italy' },
    { code: '+7', flag: '🇷🇺', name: 'Russia' },
    { code: '+378', flag: '🇸🇲', name: 'San Marino' },
    { code: '+380', flag: '🇺🇦', name: 'Ukraine' },
    { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
    { code: '+1', flag: '🇺🇸', name: 'United States' },
  ];

  items: any[] = [];
  baseUrl: string = environment.production;
  dragSrc: string = 'assets/image/Group (1).png';
  fileType: string =
    'application/pdf, text/csv, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  pay: number = 0;
  uploadedFile!: File | null;
  noOFWord: number = 0;
  fileName: String = '';
  textValue = '';
  uploadProgress: number = 0;
  isUploading: boolean = false;
  progressValue: number = 0;
  showModal1: boolean = false;
  typeOfAssignment!: any;
  userDetails: any = localStorage.getItem('userInfo');
  userInfo = JSON.parse(this.userDetails);
  userId = this.userInfo.userId;
  userName = this.userInfo.name;
  email = this.userInfo.email;
  workType = 'AssignmentFeedback';
  events: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private subsciptionPlanDetails: SubscriptionDetailsService,
    private setTransactions: PaymentTransactionService
  ) {}

  studyLevels = [
    { id: 1, value: 'Undergraduate', label: 'Undergraduate' },
    { id: 2, value: 'Masters', label: 'Master’s' },
    { id: 3, value: 'LLB', label: 'LLB' },
    { id: 4, value: 'LLM', label: 'LLM' },
    { id: 5, value: 'PhD', label: 'PhD' },
  ];
  addtionalFileName: string = '';

  handleFileInputForAdditionalFile(event: any): void {
    event.preventDefault();
    const files: FileList = event.target.files;
    console.log('additoni file run ');
    if (files && files.length > 0) {
      this.addtionalFileName = files[0].name;
      this.uploadMultipleFiles.push(files[0]);
      console.log(this.uploadMultipleFiles, 'this.uploadMultipleFiles');
      console.log(files, 'additional file is');
    }
  }

  ngOnInit(): void {
    const date = new Date();
    this.current_day = date.toLocaleDateString('en-US', { weekday: 'short' });

    this.checkvalid = false;
    const userinfo = localStorage.getItem('userInfo');
    if (userinfo) {
      const newUserinfo = JSON.parse(userinfo);
      console.log('yo', newUserinfo);
      if (newUserinfo) {
        this.form.firstName = newUserinfo.name;
        this.form.lastName = newUserinfo.lastname;
        this.form.email = newUserinfo.email;
      }
    }
    const currentDate = new Date();
    this.http
      .get(`${this.baseUrl}/api/admin/calenders/${currentDate.getMonth() + 1}`)
      .subscribe({
        next: (res: any) => {
          this.events = res;
        },
        error: (err: any) => {
          console.log(err, 'error is');
        },
      });
    const urlData = this.route.snapshot.url;
    this.typeOfAssignment = urlData[urlData.length - 1].path;
    if (this.pay > 0) {
      this.invokeStripe();
    }
    this.applied = '';
    this.fetchPromoCode();
    this.CouponValidator = false;
  }
  form: any = {
    selectedLevel: '',
    ediotrs: '',
    subject: '',
    workRequired: '',
    tellUs: '',
    calendar: '',
    firstName: '',
    lastName: '',
    email: '',
    userComments: '',
    code: '',
    urgenecyofassignments: '',
  };
  orderId: any;
  selectedCountryCode: string | null = null;

  onCountryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedCode = target.value;
    this.selectedCountryCode = selectedCode;
    console.log('Selected country code:', this.selectedCountryCode);
  }

  isLoading: boolean = false;

  // handleDateClicked(event: any) {
  //   const today = new Date().setHours(0, 0, 0, 0);
  //   const selectedDate = event.date;
  //   const selectedDateObj = new Date(selectedDate).setHours(0, 0, 0, 0);
  //   if (today > selectedDateObj) {
  //     this.toastr.warning('Select correct date');
  //     return;
  //   }
  //   this.form.calendar = selectedDate;
  //   console.log(event, 'event');
  // }

  handleDateClicked(event: any) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const threeDaysLater = new Date(today); // Create a new Date object based on today
    // its two days later not tthree i just dont wnat to change the variable
    threeDaysLater.setDate(today.getDate() + 2);
    const selectedDate = event.date;
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    if (threeDaysLater > selectedDateObj) {
      this.toastr.warning('Select correct date');
      return;
    }
    this.form.calendar = selectedDate;
    this.pay = this.standardPrice + event.price[0];
    this.form.urgenecyofassignments = '';
    console.log(event, 'calender event');
  }

  invokeStripe() {
    this.subscriptionPlan();
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_live_51OL7zsBneHs2u1Bum1WVp6hSxW9PLZPgVKMUW7u93TSw5CkkzMr0p6hYZhzN3X2amChXm79iEU9P2rIcEchPp52N000xaAxZuC',
          locale: 'auto',
          token: function (stripeToken: any) {
            // console.log(stripeToken, 'token2222');
            // this.router.navigate(['/myscans']);
            alert('Payment has been successfull!');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  onSubmit() {
    this.checkvalid = true;
    const {
      selectedLevel,
      subject,
      tellUs,
      workRequired,
      calendar,
      firstName,
      lastName,
      email,
      userComments,
      urgenecyofassignments,
    } = this.form;

    if (
      !selectedLevel ||
      !subject ||
      !workRequired ||
      !tellUs ||
      !firstName ||
      !lastName ||
      !email ||
      !this.uploadedFile
    ) {
      this.toastr.warning('Please fill all the fields');
      return;
    }

    if (!urgenecyofassignments && !calendar) {
      this.toastr.warning('Please fill all the fields2');
      return;
    }
    if (!calendar && !urgenecyofassignments) {
      this.toastr.warning('Please fill all the fields3');
      return;
    }
    this.formPay = true;
    this.formSubmitted = false;
  }
  getUrgentDate() {
    const date = new Date();

    if (this.form.urgenecyofassignments === 'Urgent') {
      // Add 12 hours to the current date
      date.setHours(date.getHours() + 12);
    } else if (this.form.urgenecyofassignments === 'Express') {
      // Add 24 hours to the current date
      date.setHours(date.getHours() + 24);
    } else if (this.form.urgenecyofassignments === 'Standard') {
      // Add 72 hours (3 days) to the current date
      date.setHours(date.getHours() + 72);
    }

    const formattedDate = this.formatDateForMySQL(date);

    return formattedDate;
  }
  formatDateForMySQL(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  async formSubmit() {
    const {
      selectedLevel,
      subject,
      tellUs,
      calendar,
      workRequired,
      firstName,
      lastName,
      email,
      userComments,
      urgenecyofassignments,
    } = this.form;

    if (
      !selectedLevel ||
      !subject ||
      !tellUs ||
      !workRequired ||
      !firstName ||
      !lastName ||
      !email ||
      // !phoneNumber ||
      // !this.selectedCountryCode ||
      !this.uploadedFile
    ) {
      this.toastr.warning('Please fill all the fields');
      return;
    }

    let userInfo: any = localStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    const userId = userInfo.userId;

    let urgetData;
    if (urgenecyofassignments) {
      urgetData = await this.getUrgentDate();
    }
    const deliveryD = !calendar ? urgetData : calendar;

    const form = new FormData();
    this.uploadMultipleFiles.forEach((file) => {
      form.append('file', file);
    });
    // form.append('file', this.uploadedFile);
    form.append('userId', userId);
    form.append('editorId', '0');
    form.append('levelOfStudy', selectedLevel);
    form.append('workRequired', workRequired);
    form.append('subject', subject);
    form.append('deliveryDate', deliveryD);
    // form.append('deliveryDate',deliveryD)
    form.append('titleOfProject', tellUs);
    form.append('firstName', firstName);
    form.append('lastName', lastName);
    form.append('emailAddress', email);
    form.append('userComments', userComments);
    form.append('typeOfAssignment', this.typeOfAssignment);
    // form.append('phoneNumber', this.selectedCountryCode + phoneNumber);
    form.append('status', 'PendingAcceptance');
    form.append('urgenecyForAssignment', urgenecyofassignments);

    this.isLoading = true;
    form.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
    this.http.post<any>(`${this.baseUrl}/api/createorders`, form).subscribe({
      next: (response: any) => {
        this.orderId = response?.data?.insertId;
        this.isLoading = false;
        if (response?.data?.insertId) {
          this.router.navigate([
            `user/orderCompletion/${response?.data?.insertId}`,
          ]);
        }
        this.toastr.success('order created successfully');
      },
      error: (error: any) => {
        this.toastr.error(error);
      },
    });
    this.checkvalid = true;
  }

  resetForm() {
    this.form = {
      selectedLevel: '',
      ediotrs: '',
      workRequired: '',
      subject: '',
      tellUs: '',
      calendar: '',
      firstName: '',
      lastName: '',
      email: '',
      userComments: '',
      urgenecyofassignments: '',
    };
    // this.selectedCountryCode = '';
    // this.router.navigate([`/orderCompletion/${this.orderId}`]);
  }

  // You can set a default selected value if needed

  levelChanged() {
    // Do something when the level changes
  }

  workRequired: any;
  selectedLevel: any;

  workRequiredChanged() {}

  // for document upload

  // browseFiles() {
  //   // Trigger file input click event
  //   const fileInput = document.getElementById('fileInput');
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // }

  handleFileInput(event: any): void {
    event.preventDefault();
    const inputElement = event.target as HTMLInputElement;
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.uploadedFile = files[0];
      this.uploadMultipleFiles.push(files[0]);
      this.showModal1 = true;
      this.isUploading = true;
      this.uploadFileWithProgress(this.uploadedFile);
      console.log(this.uploadedFile, 'file is');
      // this.toastr.success('file uploaded successfull')
    }
    inputElement.value = '';
  }

  // payment
  formSubmitted: boolean = true;
  formPay: boolean = false;
  paymentCompleted: boolean = false;
  paymentHandler: any = null;

  urgencyPrice = 37 + 35;
  expressPrice = 37 + 20;
  standardPrice = 37;
  ques = 0;
  reminder = 0;
  restprice = 0;

  chargeForScan() {
    // const allDates = document.querySelectorAll('.fc-daygrid-day');
    // allDates.forEach((date: Element) => {
    //   (date as HTMLElement).style.backgroundColor = ''; // Reset to default
    // });
    if (
      (this.form.urgenecyofassignments || this.form.calendar) &&
      this.noOFWord
    ) {
      if (
        this.noOFWord <= 1000 &&
        this.form.urgenecyofassignments === 'Urgent'
      ) {
        this.pay = 37 + 35;
      } else if (
        this.noOFWord <= 1000 &&
        this.form.urgenecyofassignments === 'Express'
      ) {
        this.pay = 37 + 20;
      } else if (
        (this.noOFWord <= 1000 &&
          this.form.urgenecyofassignments == 'Standard') ||
        this.form.urgenecyofassignments === 'standard'
      ) {
        this.pay = 37;
      } else if (
        this.noOFWord > 1000 &&
        this.form.urgenecyofassignments === 'Urgent'
      ) {
        this.ques = Math.floor(this.noOFWord / 1000);
        this.reminder = this.noOFWord % 1000;
        this.restprice = Math.floor(this.reminder / 50) * 3;
        this.pay = Math.floor(95 * this.ques + this.restprice);
      } else if (
        this.noOFWord > 1000 &&
        this.form.urgenecyofassignments === 'Express'
      ) {
        this.ques = Math.floor(Math.floor(this.noOFWord / 1000));
        this.reminder = this.noOFWord % 1000;
        this.restprice = Math.floor(this.reminder / 50) * 3;
        this.pay = Math.floor(80 * this.ques + this.restprice);
      } else if (
        (this.noOFWord > 1000 &&
          this.form.urgenecyofassignments === 'Standard') ||
        this.form.urgenecyofassignments === 'standard'
      ) {
        this.ques = Math.floor(this.noOFWord / 1000);
        this.reminder = this.noOFWord % 1000;
        this.restprice = Math.floor(this.reminder / 50) * 3;
        this.pay = Math.floor(37 * this.ques + this.restprice);
      }
    } else {
      this.pay = 0;
    }
  }

  calculateUrgencyPrice() {
    if (this.noOFWord) {
      if (this.noOFWord <= 1000) {
        this.urgencyPrice = 37 + 35;
        this.expressPrice = 37 + 20;
        this.standardPrice = 37;
      } else if (this.noOFWord > 1000) {
        this.ques = Math.floor(this.noOFWord / 1000);
        this.reminder = this.noOFWord % 1000;
        this.restprice = Math.floor(this.reminder / 50) * 3;
        this.urgencyPrice = Math.floor(95 * this.ques + this.restprice);
        this.expressPrice = Math.floor(80 * this.ques + this.restprice);
        this.standardPrice = Math.floor(37 * this.ques + this.restprice);
      }
      // this.showPrice.handleclickItem(this.standardPrice);
    } else {
      this.urgencyPrice = 0;
    }
  }

  scanAndShowCharge() {
    if (this.uploadedFile !== null) {
      if (
        this.uploadedFile?.type === 'image/png' ||
        this.uploadedFile?.type === 'image/jpeg' ||
        this.uploadedFile?.type === 'image/jpg' ||
        this.uploadedFile?.type === 'application/pdf' ||
        this.uploadedFile?.type === 'application/msword' ||
        this.uploadedFile?.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        this.uploadedFile?.type === 'text/plain' ||
        this.uploadedFile?.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        // File is an image or a PDF, process it
        const formData = new FormData();
        if (this.uploadedFile !== null) {
          const file = this.uploadedFile;
          formData.append('file', file);
          this.http
            .post(`${this.baseUrl}/api/scan/uploadAndCheck`, formData)
            .subscribe((res: any) => {
              const { noOfChars, noOfPages, fileName } = res.docDetails;
              this.fileName = fileName;
              this.noOFWord = noOfChars;
              // this.showCommentedCode = true;
              // this.isLoading = false;
              console.log(res, 'response from serber');
              // console.log({ res:res.docDetails,noOfChars, charge: this.pay }, 'res is');
            });
        }
      } else {
        this.isLoading = false;
        console.error('Only documetn are allowed');
      }
    } else if (this.textValue) {
      this.http
        .post(`${this.baseUrl}/api/scan/uploadAndCheck`, {
          text: this.textValue,
        })
        .subscribe((res: any) => {
          const { noOfChars, noOfPages } = res.docDetails;
          this.noOFWord = noOfChars;
          console.log({ res, charge: this.pay }, 'res is');
          this.isLoading = false;
        });
      // this.showTextarea = false;
      // this.textValue = '';
    }
  }

  handlePricing(event: any) {
    console.log('hsgkkfjgkjdfgjdfklgjkdfjkgjfdg');
    const value = event.target.value;

    // this.showPrice.handleclickItem( );
  }

  uploadFileWithProgress(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    this.http
      .post(`${this.baseUrl}/api/scan/uploadAndCheck`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total) {
              this.uploadProgress = Math.round(
                (100 * event.loaded) / event.total
              );
              this.progressValue = this.uploadProgress;
              console.log(this.uploadProgress, 'progress');
            }
          } else if (event.type === HttpEventType.Response) {
            const res: any = event.body;
            const { noOfChars, noOfPages, fileName } = res.docDetails;
            console.log(noOfChars, fileName, 'dbsbdmskdksnkdnskndksnd');
            this.fileName = fileName;
            this.noOFWord = noOfChars;
            this.calculateUrgencyPrice();
            console.log(res, 'response from server');
            this.uploadProgress = 100;
            this.isUploading = false;
            this.isLoading = false;
            setTimeout(() => {
              this.showModal1 = false;
            }, 2000);
          }
        },
        (error) => {
          this.isUploading = false;
          this.isLoading = false;
          setTimeout(() => {
            this.showModal1 = false;
          }, 2000);
          console.error('Upload failed', error);
          this.toastr.error('Upload failed. Please try again.');
        }
      );
  }

  serverCall(striptoken: string) {
    this.http
      .post(`${this.baseUrl}/api/checkoutPayment`, {
        pay: this.pay,
        token: striptoken,
        email:this.email
      })
      .subscribe((res: any) => {
        console.log(res, 'payment successfull');
      });
  }

  handleOneTimePayment() {
    // this.chargeForScan();
    if (this.pay > 0) {
      const paymentHandler = (<any>window).StripeCheckout.configure({
        key: 'pk_live_51OL7zsBneHs2u1Bum1WVp6hSxW9PLZPgVKMUW7u93TSw5CkkzMr0p6hYZhzN3X2amChXm79iEU9P2rIcEchPp52N000xaAxZuC',
        locale: 'auto',
        token: (stripeToken: any) => {
          this.serverCall(stripeToken.id);
          this.paymentCompleted = true;
          this.formSubmit();
          this.setTransactions
            .setTransaction(
              this.userId,
              this.userName,
              this.email,
              this.workType,
              this.pay,
              0
            )
            .subscribe((res) => {
              console.log(res, 'transaction successfully created');
            });
          this.toastr.success('payment completed successfully');
        },
      });

      // Open the payment handler
      paymentHandler.open({
        name: 'Skyline Academic',
        description: 'Payment for Assignment clarity',
        amount: this.pay * 100, // Assuming 'pay' is the payment amount
      });
    } else {
      this.serverCall('null');
      this.formSubmit();
      this.toastr.success('payment completed successfully');
      this.router.navigate(['user/dashboard']);
    }
    console.log('pay', this.pay);
    // this.resetForm();
  }

  creditForAssignment: any = '';
  subscriptionTaken: any = null;
  // subscription plan
  subscriptionPlan() {
    this.subsciptionPlanDetails.getRunningSubPlan().subscribe((res: any) => {
      this.creditForAssignment = res.credit;
      console.log(res, 'res --====');
      if (res.message === 'No Subscriptions') {
        this.subscriptionTaken = false;
      } else {
        this.subscriptionTaken = true;
        this.currentPlanIncludes();
      }
    });
  }

  assignment: boolean = false;

  currentPlanIncludes() {
    this.subsciptionPlanDetails
      .getcurrentPlanFeatures()
      .subscribe((res: any) => {
        this.assignment = res.planIncludes[0].assignment === 0 ? false : true;

        console.log(res.planIncludes[0], 'res are');
        console.log(res, 'res is');
      });
  }

  // payment with credit
  handleSubscriptionPayment() {
    if (Math.ceil(this.noOFWord / 250) > this.creditForAssignment) {
      this.toastr.error(`You Don't have Enough credits Available`);
      return;
    }
    var words = 0;
    console.log(this.form.words, 'no of words');
    if (this.noOFWord < 4000) {
      words = 1000;
    } else if (this.noOFWord >= 4000 && this.noOFWord < 10000) {
      words = 1500;
    } else if (this.noOFWord >= 10000) {
      words = 2000;
    }
    const res: any = this.subsciptionPlanDetails
      .updateCredits(words)
      .subscribe((res: any) => {
        this.formSubmit();
        console.log(res, 'res for credits');
        this.toastr.success('payment completed successfully');
        // this.resetForm();
      });

    const creditPaid = Math.ceil(words / 250);
    this.setTransactions
      .setTransaction(
        this.userId,
        this.userName,
        this.email,
        this.workType,
        0,
        creditPaid
      )
      .subscribe((res) => {
        console.log(res, 'transaction successfully created');
      });
  }

  // drag and drop
  allowedFileTypes: string[] = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (this.validateFileType(file)) {
        this.uploadedFile = file;
        this.scanAndShowCharge();
        this.showModal1 = true;
        this.isUploading = true;
        this.uploadFileWithProgress(this.uploadedFile);
      } else {
        this.toastr.error(
          'Invalid file type. Only .pdf, .docx, .doc, .txt, .xlsx files are allowed.'
        );
      }
    }
  }

  // browseFiles1(event: Event) {
  //   const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // }

  validateFileType(file: File): boolean {
    return this.allowedFileTypes.includes(file.type);
  }
  handleClearFile = () => {
    this.fileName = '';
    this.uploadedFile = null;
    this.noOFWord = 0;
    this.form.wordsforassignments = 0;
    this.pay = 0;
    this.urgencyPrice = 37 + 35;
    this.expressPrice = 37 + 20;
    this.standardPrice = 37;
    // this.showPrice.handleclickItem(this.standardPrice);
  };
  closeProgressBar() {
    this.showModal1 = false;
  }
  validateCoupon() {
    console.log(this.applied, 'check');

    this.orignalPrice = this.pay;
    this.validator = this.allPromoCode.filter(
      (item: any) => item.code === this.couponCode
    );
    console.log(this.validator);
    if (this.validator.length > 0) {
      this.couponCode = '';
      this.discountPercentage = this.validator[0].coupon.percent_off;
      if (this.pay) {
        this.applied = true;
        this.pay = +(
          this.pay -
          (this.pay * this.discountPercentage) / 100
        ).toFixed(2);
      } else {
        this.toastr.warning('Fill Details First!');
      }
    } else {
      this.applied = false;
      this.couponCode = '';
    }
    this.CouponValidator = true;
  }

  discountPercentage: number = 0;
  orignalPrice: number = 0;
  applied: any;
  allPromoCode: any = [];
  validator: any = [];
  CouponValidator: boolean = false;
  couponCode: String = '';

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
  // InvalidCoupon(){
  //     console.log(this.applied, 'check');

  //     this.orignalPrice = this.pay;
  //     this.validator = this.allPromoCode.filter(
  //       (item: any) => item.code === this.couponCode
  //     );

  //     if (this.validator.length > 0) {
  //     } else {
  //       this.pay = this.orignalPrice
  //       this.applied = false;
  //     }
  //     this.CouponValidator = true;
  // }
}
