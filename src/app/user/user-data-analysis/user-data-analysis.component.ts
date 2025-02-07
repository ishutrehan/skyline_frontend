import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubscriptionDetailsService } from 'src/app/services/subscription-details.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-data-analysis',
  templateUrl: './user-data-analysis.component.html',
  styleUrls: ['./user-data-analysis.component.css']
})
export class UserDataAnalysisComponent implements OnInit {
  baseUrl:string=environment.production;
  constructor(private toastr:ToastrService,private http:HttpClient,private subsciptionPlanDetails:SubscriptionDetailsService) { }
  uploadedFile:any=''
  showModal1 : boolean = false;
  showModal = false;
  showTextarea = false;
  isLoading: boolean = false;
  answerFromApi:string=''
  avatarAlt: string = 'Avatar';
  da1Src: string = 'assets/image/da1.png';
  da2Src: string = 'assets/image/da2.png';
  da3Src: string = 'assets/image/da3.png';
  da4Src: string = 'assets/image/da4.png';
  da5Src: string = 'assets/image/da5.png';
  da6Src: string = 'assets/image/da6.png';
  dragSrc: string = 'assets/image/Group (1).png';

  handleFileInput(event:any){
     event.preventDefault();
     const fileDetails = event.target.files[0];
     this.uploadedFile=fileDetails;
     console.log(this.uploadedFile,"uploaded file")
     if(!fileDetails){
        this.toastr.warning('file is not available')
     }
     this.toastr.success('File uploaded successfully')
  }
  // browseFiles() {
  //   // Trigger file input click event
    
  //   const fileInput = document.getElementById('fileInput');
  //   if (fileInput) {
  //     fileInput.click();
  //   }
  // }
  submitData(){
   this.toastr.success('answer is preparing...')
    this.isLoading=true;
    console.log(this.textValue,"textValue")
    const formData = new FormData();
    console.log(this.uploadedFile,"file is")
    formData.append('file',this.uploadedFile);
    formData.append('question',this.textValue);
    this.showModal = false;
     
    this.http.post(`${this.baseUrl}/api/uploadFileAskQues`,formData).subscribe((res:any)=>{
      console.log(res,"res is ")
       this.answerFromApi = res.answer2;
      this.isLoading=false;
    })
  }


  toggleModal1() {
    this.showModal = false;
  }

  
  toggleModal() {
    if(!this.uploadedFile){
      // this.showModal = !this.showModal;
      this.showModal = false;
      this.toastr.warning('firstly upload a file, then ask a question')
    }
    else{
      this.showModal = true;
    }
  }

  textValue = '';
  toggleTextarea() {
    this.showTextarea = !this.showTextarea;
  }

  onClick() {
    this.isLoading = true;
  }


  browseFiles() {
    // Trigger file input click event
    if(!this.dataAnalysis){
      // this.showModal = !this.showModal;

      this.toastr.warning(`you don't have access to upload a file,you have to upgrade your subscription`)
    }
    else{
      const fileInput = document.getElementById('fileInput');
      if (fileInput) {
        fileInput.click();
      }
    }

  }

  subscriptionTaken:boolean = false

  ngOnInit(): void {
    this.subscriptionPlan();
  }

  subscriptionPlan(){
    this.subsciptionPlanDetails.getRunningSubPlan().subscribe((res:any)=>{
      console.log(res,"res --====")
      if(res.message === 'No Subscriptions'){
        this.subscriptionTaken=false;
      }
      else{
        this.subscriptionTaken= true;
        this.currentPlanIncludes();
      }
     })
  }
  dataAnalysis:boolean = false;
  currentPlanIncludes(){
    this.subsciptionPlanDetails.getcurrentPlanFeatures().subscribe((res:any)=>{
      this.dataAnalysis =res.planIncludes[0].dataAnalysis===0?false:true;
      console.log(this.dataAnalysis,"res is")
    })
  }

}
