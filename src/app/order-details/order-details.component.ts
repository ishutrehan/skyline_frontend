import { HttpClient } from '@angular/common/http';
import { Component, ContentChild, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cal2Src: string = 'assets/image/cal.png';

  items: any[] = [];
  scanId: any = '';

  basePathOfFile: string = 'https://backend.skylineacademic.com/uploads/';
  selectedLevel: string = '';
  subject: string = '';
  workRequired: string = '';
  ediotrs: string = '';
  calendar: string = '';
  tellUs: string = '';
  otherInformation: string = '';
  preferredSources: string = '';
  essentialSources: string = '';
  additionalDocforReview: string = '';
  styleApproach: string = '';
  moduleCourse: string = '';
  structure: string = '';
  referenceStyle: string = '';
  additionalInfo: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: any;
  selectedOption: string = '';
  docForReview: string = '';
  urgenecyForAssignment: string = '';
  reviewOfAssignment: any[] = [];
  userComments: string = '';
  editorComments: string = '';
  orderId: any = null;
  userId: any = null;
  baseUrl: string = environment.production;
  myId: any = 0;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.scanId = this.route.snapshot.paramMap.get('id');
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      let formatted_data = JSON.parse(userInfo);
      this.myId = formatted_data.userId;
    }

    this.http
      .get<any>(`${this.baseUrl}/api/getorderdetails/${this.scanId}`)
      .subscribe((res: any) => {
        console.log(res, 'res');
        this.selectedLevel = res?.orderDetails[0]?.levelOfStudy;
        this.subject = res?.orderDetails[0]?.subject;
        this.workRequired = res?.orderDetails[0]?.workRequired;
        this.ediotrs = res?.orderDetails[0]?.editorId;
        let date = res?.orderDetails[0]?.deliveryDate.split('T');
        let time = date[1].split(':');
        this.calendar = date[0] + ' - ' + time[0] + ':' + time[1];
        this.tellUs = res?.orderDetails[0]?.titleOfProject;
        this.otherInformation = res?.orderDetails[0]?.otherInformation;
        this.preferredSources = res?.orderDetails[0]?.preferredSources;
        this.essentialSources = res?.orderDetails[0]?.essentialSources;
        this.styleApproach = res?.orderDetails[0]?.style;
        this.moduleCourse = res?.orderDetails[0]?.course;
        this.structure = res?.orderDetails[0]?.structure;
        this.additionalDocforReview = res?.orderDetails[0]?.additionalDocforReview;
        this.referenceStyle = res?.orderDetails[0]?.referenceStyle;
        this.additionalInfo = res?.orderDetails[0]?.additionalInformation;
        this.firstName = res?.orderDetails[0]?.firstName;
        this.lastName = res?.orderDetails[0]?.lastName;
        this.email = res?.orderDetails[0]?.emailAddress;
        this.phoneNumber = res?.orderDetails[0]?.phoneNumber;
        this.userComments = res?.orderDetails[0]?.userComments.split(',');
        this.editorComments = res?.orderDetails[0]?.editorComments.split(',');
        this.selectedOption = res?.orderDetails[0]?.status;
        this.orderId = res?.orderDetails[0]?.orderId;
        this.userId = res?.orderDetails[0]?.userId;
        this.docForReview = res?.orderDetails[0]?.docForReview;
        this.urgenecyForAssignment =res?.orderDetails[0]?.urgenecyForAssignment;
        this.reviewOfAssignment =res?.orderDetails[0]?.reviewOfAssignment.split(',');
      });
  }

  handleSelection() {
    const id = this.userId.toString();
    const formData = new FormData();
    this.uploadedFile.forEach((file) => {
      formData.append('file', file);
    });
    formData.append('status', this.selectedOption);
    formData.append('comment', this.editorComments);
    formData.append('id', id);
    formData.append('title', this.tellUs);
    formData.append('editor', this.myId);
    formData.append('orderId', this.orderId);

    this.http
      .put<any>(`${this.baseUrl}/api/updateOrders`, formData)
      .subscribe((res: any) => {
        console.log(res);
        this.toastr.success('order updated successfully');
        this.router.navigate(['/editor/dashboard']);
      });
  }

  levelChanged() {}

  workRequiredChanged() {}

  // upload doument
  showModal = false;
  showTextarea = false;
  isLoading: boolean = false;
  uploadedFile: File[] = [];
  dragSrc: string = 'assets/image/Group (1).png';

  browseFiles() {
    // Trigger file input click event

    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  }
  uploadedFilesName: string = '';
  additionalReview: string = '';

  handleFileInput(event: any) {
    this.reviewOfAssignment = [];
    event.preventDefault();
    const input = event.target;
    console.log(input.files, 'files are');
    Array.from(input.files).forEach((file: any) => {
      this.uploadedFile.push(file);
      this.reviewOfAssignment.push(file.name);
    });

    // const fileDetails = event.target.files[0];
    // console.log(fileDetails, 'fileDetails');
    // this.uploadedFile.push(fileDetails);
    // // this.additionalReview=
    if (!event.target.files) {
      this.toastr.warning('file is not available');
    }
    this.toastr.success('File uploaded successfully');
  }

  get FullPath() {
    // console.log(this.docForReview, 'filepath is:----');
    return this.basePathOfFile + this.docForReview;
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
        this.uploadedFile.push(file);
        this.toastr.success(' file uploaded successfully');
      } else {
        this.toastr.error(
          'Invalid file type. Only .pdf, .docx, .doc, .txt, .xlsx files are allowed.'
        );
      }
    }
  }

  browseFiles1(event: Event) {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  validateFileType(file: File): boolean {
    return this.allowedFileTypes.includes(file.type);
  }
}
