import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-proofreading-details',
  templateUrl: './proofreading-details.component.html',
  styleUrls: ['./proofreading-details.component.css'],
})
export class ProofreadingDetailsComponent implements OnInit {
  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cal2Src: string = 'assets/image/cal.png';

  items: any[] = [];
  editorsData: any[] = [];
  baseUrl: string = environment.production;

  basePathOfFile: string = 'https://backend.skylineacademic.com/uploads/';
  editorId: any = '';
  userId: number = 0;
  documentType: string = '';
  documentSubject: string = '';
  selectLanguage: number = 0;
  notes: string = '';
  selectServices: string = '';
  content: string = '';
  filePath: string = '';
  fileName: string = '';
  deliveryDate: string = '';
  cost: string = '';
  AddEditors: string = '';
  status: string = '';
  selectedOption: string = '';
  proofReadingFileByEditor: any = [];
  selectedEditors: number = 0;
  orderId: number = 0;
  proofReadingId: any = '';
  myId: any = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.proofReadingId = this.route.snapshot.paramMap.get('id');
    console.log(this.proofReadingId, 'ndknskdnls');

    let info = localStorage.getItem('userInfo');
    if (info) {
      let foramtedInfo = JSON.parse(info);
      this.myId = foramtedInfo.userId;
    }

    this.http
      .get<any>(`${this.baseUrl}/api/getDetails/${this.proofReadingId}`)
      .subscribe((res: any) => {
        console.log(res.response, 'response is');
        this.orderId = res?.response[0]?.proofReadingId;
        this.editorId = res?.response[0]?.editorId;
        this.documentSubject = res?.response[0]?.documentSubject;
        this.documentType = res?.response[0]?.documentType;
        this.selectLanguage = res?.response[0]?.selectLanguage;
        this.notes = res?.response[0]?.notes;
        this.selectServices = res?.response[0]?.selectServices;
        this.content = res?.response[0]?.content;
        this.filePath = res?.response[0]?.filePath;
        this.fileName = res?.response[0]?.fileName;
        this.deliveryDate = res?.response[0]?.deliveryDate;
        this.cost = res?.response[0]?.cost;
        this.selectedOption = res?.response[0]?.status;
        this.status = res?.response[0]?.status;
        this.selectedEditors = res?.response[0]?.editorId;
        this.proofReadingFileByEditor =
          res.response[0]?.proofReadingFileByEditor.split(',').filter((item:any) => item.trim() !== '');
      });



    this.http
      .get<any>(`${this.baseUrl}/api/showEditors`)
      .subscribe((res: any) => {
        console.log(res.editors, 'res===');
        this.items = res.editors;
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

  handleUpdate() {
    console.log(this.selectedEditors, 'sel edit is');
    this.editorId = this.route.snapshot.paramMap.get('id');
    this.http
      .put(`${this.baseUrl}/api/updateProofReading/${this.editorId}`, {
        editorId: this.selectedEditors,
        admin: this.myId,
      })

      .subscribe({
        next: (res: any) => {
          this.toastr.success('Editor Assigned successfully');
          this.router.navigate(['/admin/dashboard']);
        },
        error: (err: any) => {
          this.toastr.error('Error while Assigning Editors');
        },
      });
  }

  levelChanged() {}

  workRequiredChanged() {}

  get FullPath() {
    // console.log(this.fileName, 'filepath is:----');
    return this.basePathOfFile + this.fileName;
    // return 'https://backend.skylineacademic.com/uploads/1719574574244-FinalUGevensemester-2024.pdf';
  }
  get FullPath1() {
    // console.log(this.fileName, 'filepath is:----');
    return this.basePathOfFile + this.proofReadingFileByEditor;
    // return 'https://backend.skylineacademic.com/uploads/1719574574244-FinalUGevensemester-2024.pdf';
  }
}
