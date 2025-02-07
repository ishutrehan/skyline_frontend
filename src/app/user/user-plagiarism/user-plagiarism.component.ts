import { HttpClient, HttpEventType } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PaymentTransactionService } from 'src/app/services/payment-transaction.service';
import { ScanReportService } from 'src/app/services/scan-report.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription-details.service';
import { environment } from 'src/environments/environment';
interface language {
  language: string;
}

@Component({
  selector: 'app-user-plagiarism',
  templateUrl: './user-plagiarism.component.html',
  styleUrls: ['./user-plagiarism.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class UserPlagiarismComponent implements OnInit {
  userDetails: any = localStorage.getItem('userInfo');
  userInfo = JSON.parse(this.userDetails);
  userId = this.userInfo.userId;
  userName = this.userInfo.name;
  email = this.userInfo.email;
  workType = 'Plagiarism';

  deleteSrc: string = 'assets/image/delete-1-svgrepo-com.png';
  UploadSrc: string = 'assets/image/Group (1).png';
  creditSrc: string = 'assets/image/Group.png';
  paypalSrc: string = 'assets/image/Group 1171274737.png';
  AlipaySrc: string = 'assets/image/image 6.png';
  GooglepaySrc: string = 'assets/image/GooglePay.png';
  infoSrc: string = 'assets/image/info-circle.png';
  WechatSrc: string = 'assets/image/image 4.png';
  AllcardSrc: string = 'assets/image/Group 1171274742.png';
  debitSrc: string = 'assets/image/card-6376665_1280.jpg';
  CouponValidator: boolean = false;
  // card details
  // stripe: Stripe | null = null;
  baseUrl: string = environment.production;
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  cardName: string = '';
  pay: number = 0;
  token: number = 0;
  paymentCompleted: boolean = false;
  uploadedFile: File | null = null;
  noOFWord: number = 0;
  aiContentDetection: Boolean = false;
  plagiarismDetection: Boolean = false;
  toggle_tooltip: Boolean = false;
  fileName: String = '';
  couponCode: String = '';
  discountPercentage: number = 0;
  uploadSrc: string = ''; // Path to your default upload image
  paymentHandler: any = null;

  // cost according to doc
  cost1: number = 8.99;
  cost2: number = 18.99;
  cost3: number = 28.99;
  cost4: number = 9.99;
  cost5: number = 19.99;
  cost6: number = 29.99;
  cost7: number = 16.99;
  cost8: number = 26.99;
  cost9: number = 36.99;

  ngOnInit() {
    this.showReports();
    if(this.pay>0){
      this.invokeStripe();
    }
    this.hideModalAfterTimeout();
    this.checkvalid = false;
    this.applied = '';
    this.fetchPromoCode();
    this.CouponValidator = false;
  }

  handlePayment() {
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('Please Select Detection Mode', '', {
        positionClass: 'toast-center',
      });
      this.textValue = '';
      return;
    }
    if (this.noOFWord <= 50) {
      this.toastr.warning(
        'Number of words are very less to scan, upload at least 50 words'
      );
      return;
    }
    if (this.uploadedFile || this.textValue ) {
      if(this.pay>0){
      const paymentHandler = (<any>window).StripeCheckout.configure({
        key: 'pk_live_51OL7zsBneHs2u1Bum1WVp6hSxW9PLZPgVKMUW7u93TSw5CkkzMr0p6hYZhzN3X2amChXm79iEU9P2rIcEchPp52N000xaAxZuC',
        locale: 'auto',
        token: (stripeToken: any) => {
          // Use an arrow function to retain the correct 'this' context

            this.serverCall(stripeToken.id); // Use stripeToken.id to get the token ID

          // console.log(stripeToken.id, 'token2222555');
          this.paymentCompleted = true;
          if (this.uploadedFile) {
            console.log('upload doc');
            this.uploadDoc();
          } else {
            console.log('upload string');
            this.uploadText();
          }
          this.workType = 'Plagiarism + AI ';
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

          // alert('Stripe token generated!');
          // alert('payment completed successfully');
          this.toastr.success('payment completed successfully');
          this.router.navigate(['user/myscans']);
        },
      });
      // Open the payment handler
        paymentHandler.open({
          name: 'Skyline Academic',
          description: 'Payment for the scan',
          amount: this.pay * 100, // Assuming 'pay' is the payment amount
        });
      }
      else{
          if (this.uploadedFile) {
            console.log('upload doc');
            this.uploadDoc();
          } else {
            console.log('upload string');
            this.uploadText();
          }
          this.serverCall('null');
         this.toastr.success('payment completed successfully');
         setTimeout(() => {
           this.router.navigate(['user/myscans']);
         }, 2000);
      }
    } else {
      this.toastr.warning('Add Document or String for Scan');
      return;
    }
  }

  clearFileName() {
    console.log('removed file');
    this.uploadedFile = null;
    this.fileName = '';
    this.noOFWord = 0;
    this.pay = 0;
  }

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
    this.subscriptionPlan();
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: 'pk_live_51OL7zsBneHs2u1Bum1WVp6hSxW9PLZPgVKMUW7u93TSw5CkkzMr0p6hYZhzN3X2amChXm79iEU9P2rIcEchPp52N000xaAxZuC', // changed it
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

  chargeForScan(words: number) {
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('select type of scan');
      this.textValue = '';
      return;
    }

    if (this.aiContentDetection && this.plagiarismDetection) {
      if (words <= 3500) {
        this.pay = 9.99;
      } else if (words >= 3501 && words <= 15000) {
        this.pay = 19.99;
      } else {
        this.pay = 29.99;
      }
    }
  }

  showModal1: boolean = false;
  showOcr: boolean = false;
  showCommentedCode: boolean = false;
  uploadProgress: number = 0;
  isUploading: boolean = false;
  progressValue: number = 0;

  uploadFileWithProgress(file: File): void {
    const formData = new FormData();
    console.log(this.selectedLanguage, 'this.selectedLanguage========');
    formData.append('file', file);
    formData.append('aiContentDetection', this.aiContentDetection.toString());
    formData.append('plagiarismDetection', this.plagiarismDetection.toString());
    formData.append('selectedLanguage', 'eng');

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
            this.chargeForScan(noOfChars);
            console.log(res, 'response from server');
            this.uploadProgress = 100;
            this.isUploading = false;
            this.isLoading = false;
            this.showCommentedCode = true;
            setTimeout(() => {
              this.showModal1 = false;
            }, 3000);
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
  handleFileInput(event: any): void {
    console.log('chin tkap dam dam');
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('Please select Detection Mode', '', {
        positionClass: 'toast-center',
      });
      event.preventDefault();
    }
    this.showOcr = false;
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.uploadedFile = files[0];
      this.scanAndShowCharge();
      this.showModal1 = true;
      this.showCommentedCode = true;
      this.isUploading = true;
      this.uploadFileWithProgress(this.uploadedFile);
      console.log(this.uploadedFile, 'file is');
    }
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = '';
  }
  isLoading: boolean = false;

  onClick() {
    this.isLoading = true;
  }

  onChange(event: Event): void {
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('Please select Detection Mode', '', {
        positionClass: 'toast-center',
      });
      event.preventDefault();
    }
  }

  // upload doc data
  uploadDoc(): void {
    console.log(this.uploadedFile, 'this.uploadedFile');
    if (
      this.uploadedFile?.type.startsWith('image/') ||
      this.uploadedFile?.type === 'application/pdf' ||
      this.uploadedFile?.type === 'application/msword' ||
      this.uploadedFile?.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      this.uploadedFile?.type === 'text/plain' ||
      this.uploadedFile?.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      let userInfo: any = localStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      // File is an image or a PDF, process it
      const formData = new FormData();
      if (this.uploadedFile !== null) {
        formData.append('file', this.uploadedFile);
        formData.append('ContentDetection', this.aiContentDetection.toString());
        formData.append(
          'plagiarismDetection',
          this.plagiarismDetection.toString()
        );
        formData.append('selectedLanguage', this.selectedLanguage);
        formData.append('userId', userInfo.userId);
        this.http
          .post(`${this.baseUrl}/api/scan/upload`, formData)
          .subscribe((res: any) => {
            const { noOfChars, noOfPages } = res.docDetails;
            // this.chargeForScan(noOfChars);
            // console.log({ res, charge: this.pay }, 'res is');
          });
      }
    } else {
      console.error('Invalid file type. Only images and PDFs are allowed.');
    }
    // null after payment
    this.uploadedFile = null;
    // }

    // this.http.post(`http://localhost:8080/api/upload`,files[0]);
  }

  private async getStripe(): Promise<any | null> {
    // const stripe = await import('@stripe/stripe-js');
    // return stripe.loadStripe(
    //   'pk_live_51OL7zsBneHs2u1Bum1WVp6hSxW9PLZPgVKMUW7u93TSw5CkkzMr0p6hYZhzN3X2amChXm79iEU9P2rIcEchPp52N000xaAxZuC'
    // );
  }
  // async handlePayment() {
  //   // Ensure all necessary properties are defined
  //   if (!this.cardNumber || !this.expiryDate || !this.cvv || !this.cardName) {
  //     console.error('Please fill in all card details');
  //     return;
  //   }

  //   // Log the payment details for debugging
  //   console.log({
  //     cardNumber: this.cardNumber,
  //     expiryDate: this.expiryDate,
  //     cvv: this.cvv,
  //     cardName: this.cardName,
  //     pay: this.pay,
  //   });

  //   const [year, month] = this.expiryDate.split('-');

  //   // Get the Stripe object
  //   const stripe = await this.getStripe();
  //   // console.log(stripe, 'stripe');
  //   // Create a card element
  //   const elements = stripe?.elements();
  //   const cardElement = elements?.create('card');

  //   // console.log({ elements, cardElement }, 'card');
  //   // Create a token using the card element
  //   if (cardElement != undefined) {
  //     const result = await stripe?.createToken(cardElement);
  //     console.log(result, 'token');
  //   }

  //   // if (error) {
  //   //   console.error(error.message, 'error occurred');
  //   //   return;
  //   // }

  //   // console.log(token, 'token');
  //   // Send the token to your backend for payment processing
  //   // this.http
  //   //   .post<any>('http://localhost:8080/api/checkoutPayment', {
  //   //     pay: this.pay,
  //   //     cardNumber: this.cardNumber,
  //   //     token
  //   //   })
  //   //   .subscribe((res: any) => {
  //   //     console.log(res);
  //   //   });
  //   this.cardNumber = '';
  //   this.expiryDate = '';
  //   this.cvv = '';
  //   this.cardName = '';
  //   this.pay = 0;
  // }

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
              this.chargeForScan(noOfChars);
              this.showCommentedCode = true;
              this.isLoading = false;
              console.log(res, 'response from serber');
              // console.log({ res:res.docDetails,noOfChars, charge: this.pay }, 'res is');
            });
        }
      } else {
        this.isLoading = false;
        console.error('Invalid file type. Only images and PDFs are allowed.');
      }
    }
  }

  handlePlainTextInput() {
    if (this.textValue) {
      this.http
        .post(`${this.baseUrl}/api/scan/uploadAndCheck`, {
          text: this.textValue,
        })
        .subscribe((res: any) => {
          const { noOfChars, noOfPages } = res.docDetails;
          this.fileName = 'Plain Text';
          this.chargeForScan(noOfChars);
          this.noOFWord = noOfChars;
          console.log({ res, charge: this.pay }, ' for text thing res is');
          this.isLoading = false;
        });
      this.showTextarea = false;
      // this.textValue = '';
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private subsciptionPlanDetails: SubscriptionDetailsService,
    private setTransactions: PaymentTransactionService,
    private showReport: ScanReportService
  ) {}

  browseFiles(event: Event) {
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('Please Select Detection Mode', '', {
        positionClass: 'toast-center',
      });
      event.preventDefault(); // Prevent the file input click
      return;
    }
    // Trigger file input click event
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }
  showModal = false;

  toggleModal() {
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('Please Select Detection Mode', '', {
        positionClass: 'toast-center',
      });
      return;
    }
    this.showModal = !this.showModal;
    this.showCommentedCode = true;
  }

  showTextarea = false;
  textValue = '';

  toggleTextarea() {
    this.showTextarea = !this.showTextarea;
  }

  // upload text data
  uploadText() {
    this.http
      .post(`${this.baseUrl}/api/scan/upload`, {
        text: this.textValue,
        ContentDetection: this.aiContentDetection.toString(),
        plagiarismDetection: this.plagiarismDetection.toString(),
        userId: this.userInfo.userId,
      })
      .subscribe((res: any) => {
        const { noOfChars, noOfPages } = res.docDetails;
        // this.chargeForScan(noOfChars);
        // console.log({ res, charge: this.pay }, 'res is');
      });
    this.showTextarea = false;
    this.textValue = '';
  }

  Language: language[] = [
    { language: 'Option' },
    // { language: 'Afrikaans(af)' },
    // { language: 'Amharic(am)' },
    // { language: 'Arabic(ar)' },
    // { language: 'Azerbaijani(az)' },
    // { language: 'Belarusian(be)' },
    // { language: 'Bulgarian(bg)' },
    // { language: 'Bengali(bn)' },
    // { language: 'Bosnian(bs)' },
    // { language: 'Catalan(ca)' },
    // { language: 'Cebuano(ceb)' },
    // { language: 'Corsican(co)' },
    // { language: 'Czech(cs)' },
    // { language: 'Welsh(cy)' },
    // { language: 'Danish(da)' },
    // { language: 'German(de)' },
    // { language: 'Greek(el)' },
    { language: 'English(en)' },
    // { language: 'Esperanto(eo)' },
    // { language: 'Spanish(es)' },
    // { language: 'Estonian(et)' },
    // { language: 'Basque(eu)' },
    // { language: 'Persian(fa)' },
    // { language: 'Finnish(fi)' },
    // { language: 'French(fr)' },
    // { language: 'Frisian(fy)' },
    // { language: 'Irish(ga)' },
    // { language: 'Scottish Gaelic(gd)' },
    // { language: 'Galician(gl)' },
    // { language: 'Gujarati(gu)' },
    // { language: 'Hausa(ha)' },
    // { language: 'Hawaiian(haw)' },
    // { language: 'Hindi(hi)' },
    // { language: 'Hmong(hmn)' },
    // { language: 'Croatian(hr)' },
    // { language: 'Haitian Creole(ht)' },
    // { language: 'Hungarian(hu)' },
    // { language: 'Armenian(hy)' },
    // { language: 'Indonesian(id)' },
    // { language: 'Igbo(ig)' },
    // { language: 'Icelandic(is)' },
    // { language: 'Italian(it)' },
    // { language: 'Hebrew(he)' },
    // { language: 'Japanese(ja)' },
    // { language: 'Javanese(jw)' },
    // { language: 'Georgian(ka)' },
    // { language: 'Kazakh(kk)' },
    // { language: 'Khmer(km)' },
    // { language: 'Kannada(kn)' },
    // { language: 'Korean(ko)' },
    // { language: 'Kurdish(ku)' },
    // { language: 'Kyrgyz(ky)' },
    // { language: 'Latin(la)' },
    // { language: 'Luxembourgish(lb)' },
    // { language: 'Lao(lo)' },
    // { language: 'Lithuanian(lt)' },
    // { language: 'Latvian(lv)' },
    // { language: 'Maltese (mt)' },
    // { language: 'Malagasy(mg)' },
    // { language: 'Maori(mi)' },
    // { language: 'Macedonian(mk)' },
    // { language: 'Malayalam(ml)' },
    // { language: 'Mongolian(mn)' },
    // { language: 'Marathi(mr)' },
    // { language: 'Malay(ms)' },
    // { language: 'Maltese(mt)' },
    // { language: 'Burmese(my)' },
    // { language: 'Nepali(ne)' },
    // { language: 'Dutch(nl)' },
    // { language: 'Norwegian(no)' },
    // { language: 'Chichewa(ny)' },
    // { language: 'Polish(pl)' },
    // { language: 'Pashto(ps)' },
    // { language: 'Portuguese(pt)' },
    // { language: 'Romanian(ro)' },
    // { language: 'Russian(ru)' },
    // { language: 'Sindhi(sd)' },
    // { language: 'Sinhala(si)' },
    // { language: 'Slovak(sk)' },
    // { language: 'Slovenian(sl)' },
    // { language: 'Samoan(sm)' },
    // { language: 'Shona(sn)' },
    // { language: 'Somali(so)' },
    // { language: 'Serbian(sr)' },
    // { language: 'Sesotho(st)' },
    // { language: 'Sundanese(su)' },
    // { language: 'Swedish(sv)' },
    // { language: 'Swahili(sw)' },
    // { language: 'Tamil(ta)' },
    // { language: 'Telugu(te)' },
    // { language: 'Tajik(tg)' },
    // { language: 'Thai(th)' },
    // { language: 'Filipino(tl)' },
    // { language: 'Turkish(tr)' },
    // { language: 'Ukrainian(uk)' },
    // { language: 'Urdu(ur)' },
    // { language: 'Uzbek(uz)' },
    // { language: 'Vietnamese(vi)' },
    // { language: 'Vietnamese(xh)' },
    // { language: 'Yiddish(yi)' },
    // { language: 'Yoruba(yo)' },
    // { language: ' Chinese (Simplified)(zh-CN)' },
    // { language: 'Chinese (Traditional)(zh-TW)' },
    // { language: 'Zulu(zu)' },
  ];

  toggleModalOcr() {
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('Please Select Detection Mode', '', {
        positionClass: 'toast-center',
      });
      return;
    }
    this.showOcr = !this.showOcr;
    // this.showCommentedCode = true;
  }

  selectedLanguageValue: string | null = null;
  selectedLanguage: string = '';
  onLanguageSelect(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedLanguageValue = selectElement.value;
    const regex = /\(([^)]+)\)/;
    const selectedLanguageValue: any = selectElement.value.match(regex);
    this.selectedLanguage = selectedLanguageValue[1];
    console.log(this.selectedLanguage, 'selectElement.value');
  }

  creditForPlagiarism: any = '';
  subscriptionTaken: any = null;
  // subscription plan
  subscriptionPlan() {
    this.subsciptionPlanDetails.getRunningSubPlan().subscribe((res: any) => {
      this.creditForPlagiarism = res.credit;
      console.log(res, 'res --====');
      if (res.message === 'No Subscriptions') {
        this.subscriptionTaken = false;
      } else {
        this.subscriptionTaken = true;
        this.currentPlanIncludes();
      }
    });
  }

  // drag and drop

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Add any visual feedback for drag over if needed
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    // Remove any visual feedback for drag leave if needed
  }

  handleFileDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('Please Select Detection Mode', '', {
        positionClass: 'toast-center',
      });
      return;
    }
    const files = event.dataTransfer?.files;
    console.log('files ', files);
    if (files && files.length > 0) {
      this.uploadedFile = files[0];
      this.scanAndShowCharge();
      this.showModal1 = true;
      this.showCommentedCode = true;
      this.isUploading = true;
      this.uploadFileWithProgress(this.uploadedFile);
    }
  }

  browseFiles1(event: Event) {
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('Please Select Detection Mode', '', {
        positionClass: 'toast-center',
      });
      event.preventDefault();
      return;
    }
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  handleFileInput1(event: any) {
    if (!this.aiContentDetection && !this.plagiarismDetection) {
      this.toastr.warning('Please Select Detection Mode', '', {
        positionClass: 'toast-center',
      });
      return;
    }
    const files = event.target.files;
    console.log('second time running');
    if (files && files.length > 0) {
      this.uploadedFile = files[0];
      this.scanAndShowCharge();
      this.showModal1 = true;
      this.showCommentedCode = true;
      this.isUploading = true;
      // this.uploadFileWithProgress(this.uploadedFile);
    }
  }

  isModalOpen: boolean = true;

  closeModal(): void {
    this.isModalOpen = false;
  }

  plagiarism: boolean = false;
  aiDetection: boolean = false;
  currentPlanIncludes() {
    this.subsciptionPlanDetails
      .getcurrentPlanFeatures()
      .subscribe((res: any) => {
        this.plagiarism =
          res.planIncludes[0].plagDetection === 0 ? false : true;
        this.aiDetection = res.planIncludes[0].aiDetection === 0 ? false : true;
        // console.log(res.planIncludes[0],"res are")
        console.log(res, 'res is');
      });
  }
  checkvalid: boolean = false;
  // payment with credit
  // handleSubscriptionPayment() {
  //   if (!this.aiContentDetection && !this.plagiarismDetection) {
  //     this.toastr.warning('Please select Detection Mode', '', {
  //       positionClass: 'toast-center',
  //     });
  //     this.checkvalid = true
  //     this.textValue = '';
  //     return;
  //   }
  //   if (this.noOFWord <= 10) {
  //     this.toastr.warning(
  //       'Number of words are very less to scan,upload at least 10 words'
  //     );
  //     return;
  //   }
  //   var words = this.noOFWord;
  //   if (Math.ceil(this.noOFWord / 250) > this.creditForPlagiarism) {
  //     this.toastr.error(`You don't have Enough Credits Available`);
  //     return;
  //   }
  //   const res: any = this.subsciptionPlanDetails
  //     .updateCredits(words)
  //     .subscribe((res: any) => {
  //       this.paymentCompleted = true;
  //       if (this.uploadedFile) {
  //         this.uploadDoc();
  //       } else {
  //         this.uploadText();
  //       }
  //       this.toastr.success('payment completed successfully');
  //       this.router.navigate(['user/myscans']);
  //     });
  //   // payment transaction
  //   const creditPaid = Math.ceil(words / 250);
  //   this.setTransactions
  //     .setTransaction(
  //       this.userId,
  //       this.userName,
  //       this.email,
  //       this.workType,
  //       0,
  //       creditPaid
  //     )
  //     .subscribe((res) => {
  //       console.log(res, 'transaction successfully created');
  //     });
  // }

  reportLink: string = '';
  showReports() {
    this.showReport.scanReport(this.userId).subscribe((res: any) => {
      this.reportLink = `${environment.frontendUrl}/${res.result[0].scanId}/${this.userId}`;
    });
  }

  handleToogleTooltip(): void {
    this.toggle_tooltip = true;
  }
  handleTooltipDisable() {
    this.toggle_tooltip = false;
  }
  reflectPriceOnToggle(words: number) {
    if (!this.plagiarismDetection) {
      this.toastr.warning('select type of scan');
      this.aiContentDetection = false;
      this.plagiarismDetection = false;
      this.textValue = '';
      this.pay = 0;
      return;
    }
    this.aiContentDetection = true;
    this.plagiarismDetection = true;
    if (this.aiContentDetection && this.plagiarismDetection) {
      if (words <= 3500) {
        this.pay = 9.99;
      } else if (words >= 3501 && words <= 15000) {
        this.pay = 19.99;
      } else {
        this.pay = 29.99;
      }
    }
  }
  closeProgressBar() {
    this.showModal1 = false;
  }
  validateCoupon() {
    console.log(this.applied, 'check');
    let validator;
    this.orignalPrice = this.pay;
    validator = this.allPromoCode.filter(
      (item: any) => item.code === this.couponCode
    );
    console.log(validator);
    if (validator.length > 0) {
      this.couponCode = '';
      this.discountPercentage = validator[0].coupon.percent_off;
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

  orignalPrice: number = 0;
  applied: any;
  allPromoCode: any = [];

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
    let validator;
    this.orignalPrice = this.pay;
    validator = this.allPromoCode.filter(
      (item: any) => item.code === this.couponCode
    );

    if (validator.length > 0) {

    } else {
      this.pay = this.orignalPrice;
      this.applied = false;
    }
    this.CouponValidator = true;
  }
}
