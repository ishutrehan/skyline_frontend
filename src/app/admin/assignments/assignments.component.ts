import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css']
})
export class AssignmentsComponent implements OnInit {


  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cal2Src: string = 'assets/image/cal.png';

  items: any[] = [];
  scanId: any = '';
  baseUrl: string = environment.production;
  selectedLevel: string = '';
  subject: string = '';
  workRequired: string = '';
  ediotrs: number = 0;
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

  selectedEditors: number = 0;
  

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.scanId = this.route.snapshot.paramMap.get('id');

    this.http
      .get<any>(`${this.baseUrl}/api/getorderdetails/${this.scanId}`)
      .subscribe((res: any) => {
        console.log(res, 'res');
        this.selectedLevel = res?.orderDetails[0]?.levelOfStudy;
        this.subject = res?.orderDetails[0]?.subject;
        this.workRequired = res?.orderDetails[0]?.workRequired;
        this.ediotrs = res?.orderDetails[0]?.editorId;
        this.calendar = res?.orderDetails[0]?.deliveryDate;
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
        this.Status = res?.orderDetails[0]?.status;
        this.selectedEditors = res?.orderDetails[0]?.editorId;
      });
    this.http
      .get<any>(`${this.baseUrl}/api/showEditors`)
      .subscribe((res: any) => {
        console.log(res, 'res');
        this.items = res.editors;
      });
  }

  handleUpdate() {
    this.http
      .put(`${this.baseUrl}/api/updateAssignment/${this.orderId}`, {
        editorId: this.selectedEditors,
      })
      .subscribe({
        next: (res: any) => {
          this.toastr.success('Assignment updated successfully');
          this.router.navigate(['/admin/dashboard']);

        },
        error: (err: any) => {
          this.toastr.error('Error while updating assignment');
        },
      });
  }

  // handleSelection() {
  //   this.http
  //     .put<any>(`${this.baseUrl}/api/updateOrders`, {
  //       status: this.selectedOption,
  //       orderId: this.orderId,
  //     })
  //     .subscribe((res: any) => {
  //       console.log(res);
  //     });
  // }

  levelChanged() {}

  workRequiredChanged() {}
}
