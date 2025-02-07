import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-admin-assignment-clarity',
  templateUrl: './admin-assignment-clarity.component.html',
  styleUrls: ['./admin-assignment-clarity.component.css'],
})
export class AdminAssignmentClarityComponent implements OnInit {
  basePathOfFile: string = 'https://backend.skylineacademic.com/uploads/';
  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cal2Src: string = 'assets/image/cal.png';

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
  docForReview: string = '';
  additionalDoc: string = '';
  reviewOfAssignment: string = '';
  phoneNumber: any;
  selectedOption: string = '';
  Status: string = '';
  orderId: any = null;
  myId: any = null;
  urgenecyForAssignment: string = '';
  wordsforassignments: string = '';
  userComments: any = '';
  editorComments: any = '';

  selectedEditors: number = 0;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router:Router
  ) {}

  ngOnInit(): void {
    console.log(this.baseUrl, 'baseurl');
    this.scanId = this.route.snapshot.paramMap.get('id');
    let userInfo: any = localStorage.getItem('userInfo');
    if (userInfo) {
      userInfo = JSON.parse(userInfo);
      this.myId = userInfo.userId;
    }

    this.http
      .get<any>(`${this.baseUrl}/api/getorderdetails/${this.scanId}`)
      .subscribe((res: any) => {
        console.log(res, 'res=====');
        this.selectedLevel = res?.orderDetails[0]?.levelOfStudy;
        this.subject = res?.orderDetails[0]?.subject;
        this.workRequired = res?.orderDetails[0]?.workRequired;
        this.ediotrs = res?.orderDetails[0]?.editorId;
        this.calendar = res?.orderDetails[0]?.deliveryDate;
        this.calendar = new Date(this.calendar).toISOString().split('T')[0];
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
        this.phoneNumber = res?.orderDetails[0]?.phoneNumber;
        this.selectedOption = res?.orderDetails[0]?.status;
        this.orderId = res?.orderDetails[0]?.orderId;
        this.userComments = res?.orderDetails[0]?.userComments.split(',');
        this.editorComments = res?.orderDetails[0]?.editorComments.split(',');
        this.Status = res?.orderDetails[0]?.status;
        this.selectedEditors = res?.orderDetails[0]?.editorId;
        this.urgenecyForAssignment =res?.orderDetails[0]?.urgenecyForAssignment;
        this.wordsforassignments = res?.orderDetails[0]?.wordsforassignments;
        this.docForReview = res?.orderDetails[0]?.docForReview;
        this.additionalDoc = res?.orderDetails[0]?.additionalDocforReview;
        this.reviewOfAssignment =res?.orderDetails[0]?.reviewOfAssignment.split(',').filter((item:any) => item.trim() !== '');;
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

  handleUpdate() {
    console.log(this.selectedEditors, 'selectedEditors');
    this.http
      .put(`${this.baseUrl}/api/updateAssignment/${this.orderId}`, {
        editorId: this.selectedEditors,
        admin: this.myId,
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

  handleSelection() {
    try{
      this.http
      .put<any>(`${this.baseUrl}/api/updateOrdersStatusByAdmin`, {
        status: this.selectedOption,
        orderId: this.orderId,
      })
      .subscribe((res: any) => {
        console.log(res);
        this.toastr.success('order updated successfully')
        this.router.navigate(['/admin/dashboard']);
      });
    }
    catch(error){
      this.toastr.success('Something went wrong')

    }
  }

  get FullPath() {
    // console.log(this.reviewOfAssignment, 'filepath is:----');
    return this.basePathOfFile + this.reviewOfAssignment;
    // return 'https://backend.skylineacademic.com/uploads/1719574574244-FinalUGevensemester-2024.pdf';
  }

  get FullPathReview() {
    // console.log(this.docForReview, 'docforreview is:----');
    return this.basePathOfFile + this.docForReview;
    // return 'https://backend.skylineacademic.com/uploads/1719574574244-FinalUGevensemester-2024.pdf';
  }
  get FullPathAddDoc() {
    // console.log(this.docForReview, 'docforreview is:----');
    return this.basePathOfFile + this.additionalDoc;
    // return 'https://backend.skylineacademic.com/uploads/1719574574244-FinalUGevensemester-2024.pdf';
  }

  levelChanged() {}

  workRequiredChanged() {}
}
