import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-show-proofreading-details',
  templateUrl: './show-proofreading-details.component.html',
  styleUrls: ['./show-proofreading-details.component.css']
})
export class ShowProofreadingDetailsComponent implements OnInit {

  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cal2Src: string = 'assets/image/cal.png';

  items: any[] = [];
  editorsData:any[]=[]
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
  selectedEditors: number = 0;
  proofReadingFileByEditor:string=''

  proofReadingId: any = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router:Router
  ) {}

  ngOnInit(): void {

    this.proofReadingId = this.route.snapshot.paramMap.get('id');
    console.log(this.proofReadingId,"ndknskdnls")
    this.http
      .get<any>(`${this.baseUrl}/api/getDetails/${this.proofReadingId}`)
      .subscribe((res: any) => {
        console.log(res.response, 'response is');
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
       this.cost = res?.response[0]?.cost
       this.status = res?.response[0]?.status
       this.selectedEditors = res?.response[0]?.editorId;
       this.proofReadingFileByEditor=res?.response[0]?.proofReadingFileByEditor.split(',').filter((item:any)=>item.trim()!=='') ;
      });
      
      this.http
      .get<any>(`${this.baseUrl}/api/showEditors`)
      .subscribe((res: any) => {
        console.log(res.editors, 'res===');
        this.items = res.editors;
      });
      
  }



  levelChanged() {}

  workRequiredChanged() {}


  get FullPath() {
    return this.basePathOfFile + this.fileName;
  }
  get FullPathForReviewedData() {
    return this.basePathOfFile + this.proofReadingFileByEditor;
  }
}
