import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-editor-assignment-clarity',
  templateUrl: './editor-assignment-clarity.component.html',
  styleUrls: ['./editor-assignment-clarity.component.css'],
})
export class EditorAssignmentClarityComponent implements OnInit {
  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cal2Src: string = 'assets/image/cal.png';
  basePathOfFile: string = 'https://backend.skylineacademic.com/uploads/';

  items: any[] = [];
  assignedEditorDetails: any = '';
  editorExist: boolean = true;
  scanId: any = '';
  baseUrl: string = environment.production;
  selectedLevel: string = '';
  subject: string = '';
  workRequired: string = '';
  ediotrs: any = null;
  calendar: string = '';
  tellUs: string = '';
  otherInformation: string = '';
  preferredSources: string = '';
  essentialSources: string = '';
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
  Status: string = '';
  orderId: any = null;
  urgenecyForAssignment: string = '';
  wordsforassignments: string = '';
  proofReadingId: any = '';
  reviewOfAssignment: any[] = [];
  userId: any = '';
  myId: number = 0;
  fileName: string = '';
  filePath: string = '';
  userComments: string = '';
  editorComments: string = '';
  selectedEditors: number = 0;
  additionalDocforReview: string = '';
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.baseUrl, 'baseurl');
    this.scanId = this.route.snapshot.paramMap.get('id');
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      let formatted_data = JSON.parse(userInfo);
      this.myId = formatted_data.userId;
    }

    this.http
      .get<any>(`${this.baseUrl}/api/getorderdetails/${this.scanId}`)
      .subscribe((res: any) => {
        console.log(res, ' llajdk fjksdf  res');
        console.log(res.orderDetails[0].additionalDocforReview, 'dfgfdg==>');
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
        this.referenceStyle = res?.orderDetails[0]?.referenceStyle;
        this.additionalInfo = res?.orderDetails[0]?.additionalInformation;
        this.firstName = res?.orderDetails[0]?.firstName;
        this.lastName = res?.orderDetails[0]?.lastName;
        this.email = res?.orderDetails[0]?.emailAddress;
        this.fileName = res?.orderDetails[0]?.fileName;
        this.filePath = res?.orderDetails[0]?.docForReview;
        this.phoneNumber = res?.orderDetails[0]?.phoneNumber;
        this.selectedOption = res?.orderDetails[0]?.status;
        this.userComments = res?.orderDetails[0]?.userComments.split(',');
        this.editorComments = res?.orderDetails[0]?.editorComments.split(',');
        this.orderId = res?.orderDetails[0]?.orderId;
        this.userId = res?.orderDetails[0]?.userId;
        this.Status = res?.orderDetails[0]?.status;
        this.additionalDocforReview =res.orderDetails[0].additionalDocforReview;
        this.selectedEditors = res?.orderDetails[0]?.editorId;
        this.urgenecyForAssignment =res?.orderDetails[0]?.urgenecyForAssignment;
        this.wordsforassignments = res?.orderDetails[0]?.wordsforassignments;
        this.reviewOfAssignment =res?.orderDetails[0]?.reviewOfAssignment.split(',');
      });
    this.http
      .get<any>(`${this.baseUrl}/api/showEditors`)
      .subscribe((res: any) => {
        console.log(this.ediotrs, 'editor id');
        console.log(res, 'response');
        if (this.ediotrs === null) {
          this.editorExist = false;
        }
        const editorDetails = res.editors.find(
          (data: any) => data.userId === this.ediotrs
        );

        console.log(editorDetails, 'editorDetails');
        this.assignedEditorDetails = editorDetails;
        this.items = res.editors;
      });
  }

  reviewFilePath!: string;
  uploadedFilesName: string = '';
  handleFileInput(event: any) {
    event.preventDefault();
    // const fileDetails = event.target.files[0];
    // this.reviewOfAssignment = fileDetails.name;
    // this.uploadedFile = fileDetails;
    this.reviewOfAssignment = [];
    const input = event.target;
    console.log(input.files, 'files are');
    Array.from(input.files).forEach((file: any) => {
      this.uploadedFile.push(file);
      this.reviewOfAssignment.push(file.name);
    });
    if (!event.target.files) {
      this.toastr.warning('file is not available');
    }
    this.toastr.success('File uploaded successfully');
  }

  handleUpdate() {
    console.log(this.selectedEditors, 'selectedEditors');
    this.http
      .put(`${this.baseUrl}/api/updateAssignment/${this.orderId}`, {
        editorId: this.selectedEditors,
      })
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Assignment updated successfully');
        },
        error: (err: any) => {
          this.toastr.error('Error while updating assignment');
        },
      });
  }
  get FullPath() {
    return this.basePathOfFile + this.filePath;
  }
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
  uploadedFile: File[] = [];
  dragSrc: string = 'assets/image/Group (1).png';
  allowedFileTypes: string[] = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  validateFileType(file: File): boolean {
    return this.allowedFileTypes.includes(file.type);
  }
  
  levelChanged() {}

  workRequiredChanged() {}

  // update status

  handleSelection() {
    const id = this.userId.toString();
    const editorid = this.myId.toString();
    const formData = new FormData();
    this.uploadedFile.forEach((file) => {
      formData.append('file', file);
    });
    formData.append('status', this.selectedOption);
    formData.append('comment', this.editorComments);
    // formData.append('file', this.uploadedFile);
    formData.append('title', this.tellUs);
    formData.append('id', this.userId);
    formData.append('editor', editorid);
    formData.append('orderId', this.orderId);
    this.http
      .put<any>(`${this.baseUrl}/api/updateOrders`, formData)
      .subscribe((res: any) => {
        console.log(res);
        this.toastr.success('Order Updated Successfully');
        this.router.navigate(['/editor/dashboard']);
      });
  }
}
