import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { EditorDashboardComponent } from './editor/editor-dashboard/editor-dashboard.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { LoaderComponent } from './loader/loader.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AssignmentsComponent } from './admin/assignments/assignments.component';
import { ProofreadingDetailsComponent } from './admin/proofreading-details/proofreading-details.component';
import { UsermanagementComponent } from './admin/usermanagement/usermanagement.component';
import { ShowEditorsComponent } from './admin/show-editors/show-editors.component';
import { FinancialReportComponent } from './admin/financial-report/financial-report.component';
import { ShowordersComponent } from './showorders/showorders.component';
import { ProofreadingEditordetailsComponent } from './editor/proofreading-editordetails/proofreading-editordetails.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { CopyleaksReportModule } from '@copyleaks/plagiarism-report';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Admin1doughntchartComponent } from './DonghutChart/admin1doughntchart/admin1doughntchart.component';
import { Admin1barchartComponent } from './BarChart/admin1barchart/admin1barchart.component';
import { UserMyscanComponent } from './user/user-myscan/user-myscan.component';
import { UserExpendedorderComponent } from './user/user-expendedorder/user-expendedorder.component';
import { UserGoogleCalenderComponent } from './user/user-google-calender/user-google-calender.component';
import { UserMyorderdetailsComponent } from './user/user-myorderdetails/user-myorderdetails.component';
import { FeedbacksComponent } from './admin/feedbacks/feedbacks.component';
import { ProofreadingComponent } from './admin/proofreading/proofreading.component';
import { ProofreadingEditorComponent } from './editor/proofreading-editor/proofreading-editor.component';
import { ToastrModule } from 'ngx-toastr';
import { ScanReportComponent } from './user/scan-report/scan-report.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UserDataAnylsisPricingComponent } from './user/user-data-anylsis-pricing/user-data-anylsis-pricing.component';
import { UserProfileComponent } from './profile/user-profile.component';
import { BillingInformationComponent } from './billing-information/billing-information.component';
import { ShowAssignmentorderComponent } from './user/show-assignmentorder/show-assignmentorder.component';
import { UserPlagiarismComponent } from './user/user-plagiarism/user-plagiarism.component';
import { UserShoworderComponent } from './user/user-showorder/user-showorder.component';
import { UserAcademicToolkitComponent } from './user/user-academic-toolkit/user-academic-toolkit.component';
import { UserAssignmentAidComponent } from './user/user-assignment-aid/user-assignment-aid.component';
import { UserDataAnalysisComponent } from './user/user-data-analysis/user-data-analysis.component';
import { UserEditorsComponent } from './user/user-editors/user-editors.component';
import { UserbarchartComponent } from './BarChart/userbarchart/userbarchart.component';
import { UserdoughntchartComponent } from './DonghutChart/userdoughntchart/userdoughntchart.component';
import { EditorbarchartComponent } from './BarChart/editorbarchart/editorbarchart.component';
import { AdminbarchartComponent } from './BarChart/adminbarchart/adminbarchart.component';
import { EditordoughntchartComponent } from './DonghutChart/editordoughntchart/editordoughntchart.component';
import { AdmindoughntchartComponent } from './DonghutChart/admindoughntchart/admindoughntchart.component';
import { UserProofReadingComponent } from './user/user-proof-reading/user-proof-reading.component';
import { ShareReportComponent } from './user/share-report/share-report.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ChartModule } from 'primeng/chart';
import { AssignmentFeedbackComponent } from './user/assignment-feedback/assignment-feedback.component';
import { OrderCompletionComponent } from './order-completion/order-completion.component';
import { MyAssignmentComponent } from './user/my-assignment/my-assignment.component';
import { AssignmentFeedbackDetailsComponent } from './user/assignment-feedback-details/assignment-feedback-details.component';
import { EditorAssignmentClarityComponent } from './editor/editor-assignment-clarity/editor-assignment-clarity.component';
import { EditorAssignmentordersComponent } from './editor/editor-assignmentorders/editor-assignmentorders.component';
import { AdminAssignmentFeedbackComponent } from './admin/admin-assignment-feedback/admin-assignment-feedback.component';
import { AdminAssignmentClarityComponent } from './admin/admin-assignment-clarity/admin-assignment-clarity.component';
import { SubscriptionDetailsComponent } from './user/subscription-details/subscription-details.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailComponent } from './payment-fail/payment-fail.component';
import { ShowProofreadingDetailsComponent } from './user/show-proofreading-details/show-proofreading-details.component';
import { AiWritingComponent } from './user/ai-writing/ai-writing.component';
import { GoogleDriveComponent } from './google-drive/google-drive.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { UserNotificationComponent } from './user/user-notification/user-notification.component';
import { AdminCouponsComponent } from './admin/admin-coupons/admin-coupons.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
// import {  } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    AdminDashboardComponent,
    EditorDashboardComponent,
    UserDashboardComponent,
    SignInComponent,
    LoaderComponent,
    AssignmentsComponent,
    FeedbacksComponent,
    ProofreadingComponent,
    ProofreadingDetailsComponent,
    UsermanagementComponent,
    ShowEditorsComponent,
    FinancialReportComponent,
    ShowordersComponent,
    ProofreadingEditorComponent,
    ProofreadingEditordetailsComponent,
    OrderDetailsComponent,
    Admin1barchartComponent,
    UsermanagementComponent,
    UserPlagiarismComponent,
    Admin1doughntchartComponent,
    UserShoworderComponent,
    UserAcademicToolkitComponent,
    UserAssignmentAidComponent,
    UserDataAnalysisComponent,
    ScanReportComponent,
    UserEditorsComponent,
    UserbarchartComponent,
    UserdoughntchartComponent,
    EditorbarchartComponent,
    EditordoughntchartComponent,
    AdminbarchartComponent,
    AdmindoughntchartComponent,
    UserProofReadingComponent,
    UserMyscanComponent,
    UserExpendedorderComponent,
    UserGoogleCalenderComponent,
    UserMyorderdetailsComponent,
    UserDataAnylsisPricingComponent,
    UserProfileComponent,
    BillingInformationComponent,
    ShowAssignmentorderComponent,
    ShareReportComponent,
    AssignmentFeedbackComponent,
    OrderCompletionComponent,
    MyAssignmentComponent,
    AssignmentFeedbackDetailsComponent,
    EditorAssignmentClarityComponent,
    EditorAssignmentordersComponent,
    AdminAssignmentFeedbackComponent,
    AdminAssignmentClarityComponent,
    SubscriptionDetailsComponent,
    PaymentSuccessComponent,
    PaymentFailComponent,
    ShowProofreadingDetailsComponent,
    AiWritingComponent,
    GoogleDriveComponent,
    VerifyEmailComponent,
    SignUpComponent,
    UserNotificationComponent,
    AdminCouponsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CopyleaksReportModule,
    ChartModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    FullCalendarModule,
    ClipboardModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
