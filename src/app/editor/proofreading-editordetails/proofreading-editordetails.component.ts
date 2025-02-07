import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-proofreading-editordetails',
  templateUrl: './proofreading-editordetails.component.html',
  styleUrls: ['./proofreading-editordetails.component.css'],
})
export class ProofreadingEditordetailsComponent implements OnInit {
  avatarAlt: string = 'Avatar';
  cs0Src: string = 'assets/image/arrow-left.png';
  cal2Src: string = 'assets/image/cal.png';

  items: any[] = [];

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
  selectedOption: string = '';
  proofReadingId: any = '';
  myId: any = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  proofReadingFileByEditor: any[] = [];
  ngOnInit(): void {
    this.proofReadingId = this.route.snapshot.paramMap.get('id');
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      let formatted_data = JSON.parse(userInfo);
      this.myId = formatted_data.userId;
    }
    this.http
      .get<any>(`${this.baseUrl}/api/getDetails/${this.proofReadingId}`)
      .subscribe((res: any) => {
        console.log(res.response, 'editor res of response is');

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
        this.userId = res?.response[0]?.userId;
        this.proofReadingFileByEditor =
          res?.response[0]?.proofReadingFileByEditor
            .split(',')
            .filter((item: any) => item.trim() !== '');
      });
  }

  handleUpdate() {
    // console.log(this.userId,'ya hai meri user id ')
    const id = this.userId.toString();
    const formData = new FormData();
    this.uploadedFile.forEach((file) => {
      formData.append('file', file);
    });
    formData.append('status', this.selectedOption);
    formData.append('id', id); //assignmnet id
    formData.append('editor', this.myId); //editor id
    // formData.append('file', this.uploadedFile);
    formData.append('proofReadingId', this.proofReadingId);
    this.http
      .put<any>(`${this.baseUrl}/api/updateProofReadingStatus`, formData)
      .subscribe((res: any) => {
        console.log(res);
        this.toastr.success('Status updated successfully');
        this.router.navigate(['/editor/dashboard']);
      });
  }

  get FullPath() {
    // console.log(this.fileName, 'filepath is:----');
    return this.basePathOfFile + this.fileName;
    // return 'https://backend.skylineacademic.com/uploads/1719574574244-FinalUGevensemester-2024.pdf';
  }

  levelChanged() {}

  workRequiredChanged() {}

  reviewFilePath!: string;
  uploadedFilesName: string = '';
  handleFileInput(event: any) {
    event.preventDefault();
    // const fileDetails = event.target.files[0];
    // this.reviewFilePath=fileDetails.name
    // console.log(fileDetails,"detials")
    // this.uploadedFile = fileDetails;
    const input = event.target;
    console.log(input.files, 'files are');
    this.proofReadingFileByEditor = [];
    Array.from(input.files).forEach((file: any) => {
      this.uploadedFile.push(file);
      this.proofReadingFileByEditor.push(file.name);
      // this.uploadedFilesName=this.uploadedFilesName+file.name+',';
    });
    if (!event.target.files) {
      this.toastr.warning('file is not available');
    }
    this.toastr.success('File uploaded successfully');
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
