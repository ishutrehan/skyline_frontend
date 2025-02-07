import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentTransactionService } from 'src/app/services/payment-transaction.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription-details.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-proof-reading',
  templateUrl: './user-proof-reading.component.html',
  styleUrls: ['./user-proof-reading.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserProofReadingComponent implements OnInit {
  userData: any = localStorage.getItem('userInfo');
  userDetails: any = JSON.parse(this.userData);
  fileType: string = 'application/pdf, application/msword'; // Supported file types
  pay: number = 0;
  addon: number = 0;
  uploadedFile: any | null = null;
  noOFWord: number = 0;
  baseUrl: string = environment.production;
  fileName: String = '';
  uploadDocFromDrive: boolean = false;
  // Berify Your editor and pay
  documenttype: string = '';
  documentsubject: string = '';
  selectlanguage: string = '';
  notes: string = '';
  couponCode: String = '';
  services: string = '';
  checkbox4: boolean = false;
  toggle_tooltip1: boolean = false;
  toggle_tooltip2: boolean = false;
  toggle_tooltip3: boolean = false;
  // checkbox5: boolean = false;
  radioGroup: string = 'other';
  deliverydate: string = '';
  disablePaymentButton: boolean = false;
  checkvalid: boolean = false;

  userDetail: any = localStorage.getItem('userInfo');
  userInfo = JSON.parse(this.userDetail);
  userId = this.userInfo.userId;
  userName = this.userInfo.name;
  email = this.userInfo.email;
  workType = 'Proofreading';

  // round the value in 2 digits
  roundToTwo(num: number): number {
    return Math.round(num * 100) / 100;
  }

  handleFileInput(event: any): void {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.uploadedFile = files[0];
      this.scanAndShowCharge();
      this.showModal1 = true;
      this.showCommentedCode = true;
      this.isUploading = true;
      this.showDropdown = false;
      this.uploadFileWithProgress(this.uploadedFile);
      console.log(this.uploadedFile, 'file is');
    }
  }

  // constructor(private http: HttpClient) {}
  browseFiles() {
    // Trigger file input click event
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }

  chargeForScan(words: number) {
    // advance pack
    if (this.services == 'advance' && !this.checkbox4) {
      if (this.radioGroup === 'today') {
        this.pay = this.roundToTwo(this.noOFWord * (0.05 + 0.03));
      } else if (this.radioGroup === 'tomorrow') {
        this.pay = this.roundToTwo(this.noOFWord * (0.05 + 0.02));
      } else if (this.radioGroup === 'other') {
        this.pay = this.roundToTwo(this.noOFWord * 0.05);
      }
    }
    // basic pack
    else if (this.services == 'basic' && !this.checkbox4) {
      if (this.radioGroup === 'today') {
        this.pay = this.roundToTwo(this.noOFWord * (0.03 + 0.02));
      } else if (this.radioGroup === 'tomorrow') {
        this.pay = this.roundToTwo(this.noOFWord * (0.03 + 0.01));
      } else if (this.radioGroup === 'other') {
        this.pay = this.roundToTwo(this.noOFWord * 0.03);
      }
    }
    // advance pack with report
    else if (this.services == 'advance' && this.checkbox4) {
      if (this.radioGroup === 'today') {
        this.pay = this.roundToTwo(this.noOFWord * (0.05 + 0.03) + 20);
      } else if (this.radioGroup === 'tomorrow') {
        this.pay = this.roundToTwo(this.noOFWord * (0.05 + 0.02) + 20);
      } else if (this.radioGroup === 'other') {
        this.pay = this.roundToTwo(this.noOFWord * 0.05 + 20);
      }
    }
    // basic pack with report
    else if (this.services == 'basic' && this.checkbox4) {
      if (this.radioGroup === 'today') {
        this.pay = this.roundToTwo(this.noOFWord * (0.03 + 0.02) + 20);
      } else if (this.radioGroup === 'tomorrow') {
        this.pay = this.roundToTwo(this.noOFWord * (0.03 + 0.01) + 20);
      } else if (this.radioGroup === 'other') {
        this.pay = this.roundToTwo(this.noOFWord * 0.03 + 20);
      }
    }
  }
  scanAndShowChargeForText() {
    if (this.textValue) {
      this.http
        .post(`${this.baseUrl}/api/scan/uploadAndCheck`, {
          text: this.textValue,
        })
        .subscribe((res: any) => {
          const { noOfChars, noOfPages } = res.docDetails;
          // this.chargeForScan(noOfChars);
          this.fileName = ' Plain Text';
          this.noOFWord = noOfChars;
          this.isLoading = false;
        });
      this.showTextarea = false;
      // this.textValue = '';
    }
  }

  scanAndShowCharge() {
    if (this.uploadedFile) {
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
              // this.chargeForScan(noOfChars);
              this.isLoading = false;
              this.showCommentedCode = true;

              console.log(res, 'response from server');
            });
        }
      } else {
        this.isLoading = false;
        console.error('Invalid file type. Only images and PDFs are allowed.');
      }
    }
  }

  // textarea

  showFull = false;
  toggleShowFull() {
    console.log(this.showFull, 'show');

    this.showFull = !this.showFull;
  }

  showModal = false;
  toggleModal() {
    this.showModal = !this.showModal;
  }

  showTextarea = false;
  textValue = '';
  toggleTextarea() {
    this.showTextarea = !this.showTextarea;
  }

  isLoading: boolean = false;
  onClick() {
    this.isLoading = true;
  }

  handleSubmit() {
    console.log('submitted');
    console.log(this.services);
    this.proofreading = true;
    this.checkvalid = true;
    if (
      !this.noOFWord ||
      !this.documenttype ||
      // !this.notes ||
      !this.documentsubject ||
      !this.selectlanguage ||
      !this.radioGroup
    ) {
      this.toastr.warning('Please fill in the required information.');
      return;
    }

    if (!this.services) {
      this.toastr.warning('Please fill in the required information.');
      return;
    }

    if (this.checkbox4 === true && this.subscriptionTaken === true) {
      if (this.formating === false) {
        this.toastr.warning(`you don't have access to use formating option`);
        return;
      }
    }

    this.chargeForScan(this.noOFWord);
    this.toastr.success('Form submitted, Pay Now');
  }

  deliveryDate() {
    const date = new Date();

    if (this.radioGroup === 'tomorrow') {
      this.deliverydate = new Date(
        date.setHours(date.getHours() + 24)
      ).toLocaleString('en-GB', { timeZone: 'Europe/London' });
    }

    if (this.radioGroup === 'today') {
      this.deliverydate = new Date(
        date.setHours(date.getHours() + 12)
      ).toLocaleString('en-GB', { timeZone: 'Europe/London' });
    }

    if (this.radioGroup === 'other') {
      this.deliverydate = new Date(
        date.setHours(date.getHours() + 72)
      ).toLocaleString('en-GB', { timeZone: 'Europe/London' });
    }
  }
  // userId,
  //       documentType,
  //       documentSubject,
  //       selectLanguage,
  //       notes,
  //       selectServices,
  //       filePath,
  //       fileName,
  //       deliveryDate,
  //       +cost,
  async handleFormSubmission() {
    this.deliveryDate();
    if (this.uploadDocFromDrive) {
      let result = '';
      if (this.services == 'basic') {
        result += 'Basic Proofreading';
      }
      if (this.services == 'advance') {
        if (result !== '') {
          result += ' & ';
        }
        result += 'Advance Proofreading';
      }
      if (this.checkbox4) {
        if (result !== '') {
          result += ' & ';
        }
        result += 'Plagiarism Report';
      }
      console.log(result);

      this.http
        .post(`${this.baseUrl}/api/uploadDriveDataInMemory`, {
          userId: this.userDetails.userId,
          documentType: this.documenttype,
          documentSubject: this.documentsubject,
          selectLanguage: this.selectlanguage,
          notes: this.notes,
          selectServices: result,
          fileName: this.driveFileName,
          deliveryDate: this.deliverydate,
          cost: this.pay,
        })
        .subscribe({
          next: (res: any) => {
            this.toastr.success('form submitted successfully');
          },
          error: (err: any) => {
            this.toastr.error('something went wrong');
          },
        });
    } else if (this.uploadedFile !== null) {
      const formData = new FormData();
      const file = this.uploadedFile;
      formData.append('file', file);
      formData.append('editorId', `${0}`);
      formData.append('userId', `${this.userDetails.userId}`);
      formData.append('documentType', this.documenttype);
      formData.append('documentSubject', this.documentsubject);
      formData.append('selectLanguage', this.selectlanguage);
      formData.append('notes', this.notes);
      formData.append('cost', this.pay.toString());
      formData.append('deliveryDate', this.deliverydate);

      let result = '';

      // write this logic again

      if (this.services == 'basic') {
        result += 'Basic Proofreading';
      }
      if (this.services == 'advance') {
        if (result !== '') {
          result += ' & ';
        }
        result += 'Advance Proofreading';
      }
      if (this.checkbox4) {
        if (result !== '') {
          result += ' & ';
        }
        result += 'Plagiarism Report';
      }
      formData.append('selectServices', result);

      this.http
        .post(`${this.baseUrl}/api/scan/proofreadingAndEditing`, formData)
        .subscribe({
          next: (res: any) => {
            this.toastr.success('form submitted successfully');
          },
          error: (err: any) => {
            this.toastr.error('something went wrong');
          },
        });
    } else {
      let result = '';
      if (this.services == 'basic') {
        result += 'proofreading';
      }
      if (this.services == 'advance') {
        if (result !== '') {
          result += ' & ';
        }
        result += 'editing';
      }
      if (this.checkbox4) {
        if (result !== '') {
          result += ' & ';
        }
        result += 'formating';
      }

      this.http
        .post(`${this.baseUrl}/api/scan/proofreadingAndEditing`, {
          userId: this.userDetails.userId,
          editorId: 0,
          documentType: this.documenttype,
          documentSubject: this.documentsubject,
          selectLanguage: this.selectlanguage,
          notes: this.notes,
          selectServices: result,
          content: this.textValue,
          cost: this.pay,
          deliveryDate: this.deliverydate,
        })
        .subscribe({
          next: (res: any) => {
            this.toastr.success('form submitted successfully');
          },
          error: (err: any) => {
            this.toastr.error('something went wrong');
          },
        });
    }
    // this.usertype = '';
    this.documenttype = '';
    this.documentsubject = '';
    this.selectlanguage = '';
    this.notes = '';
    this.services = '';
    // this.checkbox1 = false;
    // this.checkbox3 = false;
    this.checkbox4 = false;
    this.radioGroup = '';
  }
  isButtonActivated: { [key: number]: boolean } = {};

  toggleButton(buttonNumber: number) {
    this.isButtonActivated[buttonNumber] =
      !this.isButtonActivated[buttonNumber];
  }

  UploadSrc: string = 'assets/image/Group (4).png';
  serviceSrc: string = 'assets/image/Group 1171274759.png';
  importantSrc: string = 'assets/image/Group (5).png';
  paySrc: string = 'assets/image/Group (6).png';
  uparrowSrc: string = 'assets/image/Group (7).png';
  downarrowSrc: string = 'assets/image/Group (8).png';
  dragSrc: string = 'assets/image/Group (1).png';
  infoSrc: string = 'assets/image/info-circle.png';
  FrameSrc: string = 'assets/image/Frame.png';
  Frame1Src: string = 'assets/image/image 7.png';
  Frame2Src: string = 'assets/image/image 9.png';
  Frame3Src: string = 'assets/image/Frame 427323362.png';
  Frame4Src: string = 'assets/image/Frame (1).png';
  Frame5Src: string = 'assets/image/Frame (2).png';
  Frame6Src: string = 'assets/image/Frame (3).png';
  tickSrc: string = 'assets/image/tick.png';
  tick1Src: string = 'assets/image/tick-circle.png';

  showDetails = true;
  toggleShowDetails() {
    console.log(this.showDetails, 'show');
    this.showDetails = !this.showDetails;
  }

  showPayment = true;
  togglePayment() {
    this.showPayment = !this.showPayment;
  }

  // form validation

  cardForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
    private subsciptionPlanDetails: SubscriptionDetailsService,
    private setTransactions: PaymentTransactionService
  ) {
    this.cardForm = this.formBuilder.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
    });
  }

  // payment

  firstname: string = '';
  lastname: string = '';
  // email: string = '';
  cardNumber: string = '';
  checkbox6: boolean = false;
  paymentHandler: any = null;
  paymentCompleted: boolean = false;

  showModal1: boolean = false;
  creditForProofreading!: number;
  // subscription details
  subscriptionTaken: boolean = false;

  serverCall(striptoken: string) {
    this.http
      .post(`${this.baseUrl}/api/checkoutPayment`, {
        pay: this.pay,
        token: striptoken,
        email:this.email

      })
      .subscribe((res: any) => {
        console.log(res, 'payment successful');
      });
  }

  invokeStripe() {
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

  ngOnInit() {
    this.subscriptionPlan();
    if(this.pay>0){
      this.invokeStripe();
    }
    this.checkvalid = false;
    this.applied = '';
    this.fetchPromoCode();
    this.CouponValidator = false;
  }
  handleOneTimePayment() {
    if (
      !this.noOFWord ||
      !this.documenttype ||
      // !this.notes ||
      !this.documentsubject ||
      !this.selectlanguage ||
      !this.radioGroup
    ) {
      this.toastr.warning('Please submit the form');
      return;
    }
    if (!this.services) {
      this.toastr.warning('Please submit the form');
      return;
    }
    if (!this.handleSubmit) {
      this.toastr.warning('Please submit form first');
      return;
    }
    // if (this.uploadedFile || this.textValue) {
    if(this.pay>0){

      const paymentHandler = (<any>window).StripeCheckout.configure({
        key: 'pk_live_51OL7zsBneHs2u1Bum1WVp6hSxW9PLZPgVKMUW7u93TSw5CkkzMr0p6hYZhzN3X2amChXm79iEU9P2rIcEchPp52N000xaAxZuC',
        locale: 'auto',
        token: (stripeToken: any) => {
          console.log(stripeToken.id, 'create a new token');
          this.serverCall(stripeToken.id);
          this.paymentCompleted = true;
          this.handleFormSubmission();
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
          this.router.navigate(['user/dashboard']);
        },
      });

      // Open the payment handler
      paymentHandler.open({
        name: 'Skyline Academic',
        description: 'Payment for proofreading and editing',
        amount: this.pay * 100, // Assuming 'pay' is the payment amount
      });
    }
    else{
      this.handleFormSubmission();
      this.serverCall('null');
       this.toastr.success('payment completed successfully');
       this.router.navigate(['user/dashboard']);
    }
    }

  showCommentedCode: boolean = false;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  progressValue: number = 0;

  uploadFileWithProgress(file: File): void {
    console.log(file, 'file');
    const formData = new FormData();
    formData.append('file', file);
    this.http
      .post(`${this.baseUrl}/api/scan/uploadAndCheck`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe(
        (event) => {
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
            this.chargeForScan(noOfChars);
            console.log(res, 'response from server');
            this.uploadProgress = 100;
            this.isUploading = false;
            this.isLoading = false;
            // this.showModal1 = false;
            this.showCommentedCode = true;
            setTimeout(() => {
              this.showModal1 = false;
            }, 2000);
          }
        },
        (error) => {
          this.isUploading = false;
          this.isLoading = false;
          this.showModal1 = false;
          console.error('Upload failed', error);
          this.toastr.error('Upload failed. Please try again.');
        }
      );
  }
  hideModalAfterTimeout() {
    setTimeout(() => {}, 5000);
  }

  toggleModal1() {
    this.showModal1 = false;
  }

  // subscription plan
  subscriptionPlan() {
    this.subsciptionPlanDetails.getRunningSubPlan().subscribe((res: any) => {
      this.creditForProofreading = res.credit;
      console.log(res, 'res --====');
      if (res.message === 'No Subscriptions') {
        this.subscriptionTaken = false;
      } else {
        this.subscriptionTaken = true;
        this.currentPlanIncludes();
      }
    });
  }

  proofreading: boolean = false;
  editing: boolean = false;
  formating: boolean = false;
  planType: string = '';
  currentPlanIncludes() {
    this.subsciptionPlanDetails
      .getcurrentPlanFeatures()
      .subscribe((res: any) => {
        this.proofreading =
          res.planIncludes[0].proofreading === 0 ? false : true;
        this.editing = res.planIncludes[0].editing === 0 ? false : true;
        this.formating = res.planIncludes[0].formating === 0 ? false : true;
        this.planType = res.planIncludes[0].planType;
        // console.log(res.planIncludes[0],"res are")
        console.log(res, 'res is');
      });
  }

  updateCreditsValue() {
    const res: any = this.subsciptionPlanDetails
      .updateCredits(this.noOFWord)
      .subscribe((res: any) => {
        console.log(res, 'res for credits');
        this.handleFormSubmission();
      });
  }
  // payment with credit
  handleSubscriptionPayment() {
    if (
      !this.noOFWord ||
      !this.documenttype ||
      // !this.notes ||
      !this.documentsubject ||
      !this.selectlanguage ||
      !this.radioGroup
    ) {
      this.toastr.warning('Please submit the form');
      return;
    }
    if (!this.services) {
      this.toastr.warning('Please submit the form');
      return;
    }
    if (!this.handleSubmit) {
      this.toastr.warning('Please submit form first');
      return;
    }

    if (Math.ceil(this.noOFWord / 250) > this.creditForProofreading) {
      this.toastr.warning(`You don't have Enough Credits Available`);
      return;
    }
    if (this.planType === 'Basic') {
      this.toastr.warning('You dont have Access for Formating');
      return;
    }

    //update credits
    this.updateCreditsValue();
    // payment transaction
    const creditPaid = Math.ceil(this.noOFWord / 250);
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
    this.router.navigate(['user/dashboard']);
  }

  clearFileName() {
    this.fileName = '';
    this.noOFWord = 0;
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
        this.showCommentedCode = true;
        this.isUploading = true;
        this.uploadFileWithProgress(this.uploadedFile);
      } else {
        this.toastr.error(
          'Invalid file type. Only .pdf, .docx, .doc, .txt, .xlsx files are allowed.'
        );
      }
    }
  }

  validateFileType(file: File): boolean {
    return this.allowedFileTypes.includes(file.type);
  }

  // google drive
  showDropdown = false;
  googledrive: string = 'assets/image/drive.png';
  upload: string = 'assets/image/up.png';
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  triggerGooglePicker() {
    const googlePickerComponent = document.querySelector('app-google-picker');
    const authorizeButton =
      googlePickerComponent?.shadowRoot?.getElementById('authorize_button');

    if (authorizeButton) {
      authorizeButton.click();
    }
  }

  private downloadFile(downloadUrl: string, fileName: string) {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.click();
  }

  driveFileName: string = '';
  // select files from drive
  async onFileSelected(fileData: any) {
    console.log(fileData.result.webContentLink, 'result');
    this.driveFileName = fileData.result.originalFilename;
    this.http
      .post(`${this.baseUrl}/api/uploadDriveFileCheckWords`, {
        fileName: fileData.result.originalFilename,
        fileId: fileData.result.id,
        mimetype: fileData.result.mimeType,
        link: fileData.result.webContentLink,
      })
      .subscribe((res: any) => {
        this.uploadDocFromDrive = true;
        console.log(res, 'res is');
        const { noOfChars, noOfPages, fileName } = res.docDetails;
        this.fileName = fileName;
        this.noOFWord = noOfChars;
        this.isLoading = false;
        this.showDropdown = false;
      });
  }

  // new functin to toggle tooltip section on hover i icon built on 20.9.2024
  //start
  handleToogleTooltip(num: number): void {
    switch (num) {
      case 1:
        this.toggle_tooltip1 = true;
        break;
      case 2:
        this.toggle_tooltip2 = true;
        break;
      case 3:
        this.toggle_tooltip3 = true;
        break;
      default: {
        this.toggle_tooltip1 = false;
        this.toggle_tooltip2 = false;
        this.toggle_tooltip3 = false;
      }
    }
  }
  handleTooltipDisable() {
    this.toggle_tooltip1 = false;
    this.toggle_tooltip2 = false;
    this.toggle_tooltip3 = false;
  }
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
  InvalidCoupon() {
    console.log(this.applied, 'check');

    this.orignalPrice = this.pay;
    this.validator = this.allPromoCode.filter(
      (item: any) => item.code === this.couponCode
    );

    if (this.validator.length > 0) {
    } else {
      this.pay = this.orignalPrice;
      this.applied = false;
    }
    this.CouponValidator = true;
  }
  //end
}
