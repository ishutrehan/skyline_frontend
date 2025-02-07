import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assignment-feedback-details',
  templateUrl: './assignment-feedback-details.component.html',
  styleUrls: ['./assignment-feedback-details.component.css']
})
export class AssignmentFeedbackDetailsComponent implements OnInit {


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
  ediotrs: any = null;
  calendar: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: any;
  selectedOption: string = '';
  Status: string = '';
  orderId: any = null;
  urgenecyForAssignment: string = '';
  wordsforassignments: string ='';
  titleOfProject: string = '';
  workRequired: string = '';

  docForReview: string ='';
  additionalDocforReview: string ='';
  reviewOfAssignment : string = '';
  filePath: string = '';
  userComments: any = '';
  editorComments: any = '';
  selectedEditors: number = 0;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.baseUrl, 'baseurl');
    this.scanId = this.route.snapshot.paramMap.get('id');

    this.http
      .get<any>(`${this.baseUrl}/api/getorderdetails/${this.scanId}`)
      .subscribe((res: any) => {
        console.log(res, 'res');
        this.selectedLevel = res?.orderDetails[0]?.levelOfStudy;
        this.subject = res?.orderDetails[0]?.subject;
        this.ediotrs = res?.orderDetails[0]?.editorId;
        this.calendar = res?.orderDetails[0]?.deliveryDate;
        this.workRequired = res?.orderDetails[0]?.workRequired;
        this.firstName = res?.orderDetails[0]?.firstName;
        this.lastName = res?.orderDetails[0]?.lastName;
        this.email = res?.orderDetails[0]?.emailAddress;
        this.phoneNumber = res?.orderDetails[0]?.phoneNumber;
        this.selectedOption = res?.orderDetails[0]?.status;
        this.orderId = res?.orderDetails[0]?.orderId;
        this.Status = res?.orderDetails[0]?.status;
        this.selectedEditors = res?.orderDetails[0]?.editorId;
        this.urgenecyForAssignment = res?.orderDetails[0]?.urgenecyForAssignment;
        this.userComments = res?.orderDetails[0]?.userComments.split(',');
        this.editorComments = res?.orderDetails[0]?.editorComments.split(',');
        this.wordsforassignments = res?.orderDetails[0]?.wordsforassignments;
        this.titleOfProject = res?.orderDetails[0]?.titleOfProject;
        this.docForReview = res?.orderDetails[0]?.docForReview;
        this.additionalDocforReview = res?.orderDetails[0]?.additionalDocforReview;
        this.reviewOfAssignment = res?.orderDetails[0]?.reviewOfAssignment.split(',').filter((item:any) => item.trim() !== '');

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



  levelChanged() {}

  workRequiredChanged() {}

  get FullPath(): string {
    // console.log(this.reviewOfAssignment, 'filepath is:----');
    return this.basePathOfFile + this.reviewOfAssignment;
        // return 'https://backend.skylineacademic.com/uploads/1719574574244-FinalUGevensemester-2024.pdf';
  }


  get FullPathReview() {
    // console.log(this.docForReview,  'filepath is:----');
    return this.basePathOfFile + this.docForReview ;

  }

}
