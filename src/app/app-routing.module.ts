import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AssignmentsComponent } from './admin/assignments/assignments.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FeedbacksComponent } from './admin/feedbacks/feedbacks.component';
import { ProofreadingComponent } from './admin/proofreading/proofreading.component';
import { ProofreadingDetailsComponent } from './admin/proofreading-details/proofreading-details.component';
import { UsermanagementComponent } from './admin/usermanagement/usermanagement.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { ShowEditorsComponent } from './admin/show-editors/show-editors.component';
import { FinancialReportComponent } from './admin/financial-report/financial-report.component';
import { AdminCouponsComponent } from './admin/admin-coupons/admin-coupons.component';
import { ShowordersComponent } from './showorders/showorders.component';
import { ProofreadingEditorComponent } from './editor/proofreading-editor/proofreading-editor.component';
import { ProofreadingEditordetailsComponent } from './editor/proofreading-editordetails/proofreading-editordetails.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { ScanReportComponent } from './user/scan-report/scan-report.component';
import { UserPlagiarismComponent } from './user/user-plagiarism/user-plagiarism.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserAcademicToolkitComponent } from './user/user-academic-toolkit/user-academic-toolkit.component';
import { UserProofReadingComponent } from './user/user-proof-reading/user-proof-reading.component';
import { UserAssignmentAidComponent } from './user/user-assignment-aid/user-assignment-aid.component';
import { UserDataAnalysisComponent } from './user/user-data-analysis/user-data-analysis.component';
import { UserShoworderComponent } from './user/user-showorder/user-showorder.component';
import { UserNotificationComponent } from './user/user-notification/user-notification.component';
import { EditorDashboardComponent } from './editor/editor-dashboard/editor-dashboard.component';
import { UserMyscanComponent } from './user/user-myscan/user-myscan.component';
import { UserEditorsComponent } from './user/user-editors/user-editors.component';
import { UserExpendedorderComponent } from './user/user-expendedorder/user-expendedorder.component';
import { UserMyorderdetailsComponent } from './user/user-myorderdetails/user-myorderdetails.component';
import { UserDataAnylsisPricingComponent } from './user/user-data-anylsis-pricing/user-data-anylsis-pricing.component';
import { BillingInformationComponent } from './billing-information/billing-information.component';
import { UserProfileComponent } from './profile/user-profile.component';
import { ShowAssignmentorderComponent } from './user/show-assignmentorder/show-assignmentorder.component';
import { ShareReportComponent } from './user/share-report/share-report.component';
import { AssignmentFeedbackComponent } from './user/assignment-feedback/assignment-feedback.component';
import { OrderCompletionComponent } from './order-completion/order-completion.component';
import { MyAssignmentComponent } from './user/my-assignment/my-assignment.component';
import { AssignmentFeedbackDetailsComponent } from './user/assignment-feedback-details/assignment-feedback-details.component';
import { EditorAssignmentClarityComponent } from './editor/editor-assignment-clarity/editor-assignment-clarity.component';
import { AdminAssignmentFeedbackComponent } from './admin/admin-assignment-feedback/admin-assignment-feedback.component';
import { AdminAssignmentClarityComponent } from './admin/admin-assignment-clarity/admin-assignment-clarity.component';
import { SubscriptionDetailsComponent } from './user/subscription-details/subscription-details.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentFailComponent } from './payment-fail/payment-fail.component';
import { ShowProofreadingDetailsComponent } from './user/show-proofreading-details/show-proofreading-details.component';
import { RoleGuardService } from './services/role-guard.service';
import { AiWritingComponent } from './user/ai-writing/ai-writing.component';
import { GoogleDriveComponent } from './google-drive/google-drive.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
const routes: Routes = [
  // admin routes
  { path: '', redirectTo: 'signin', pathMatch: 'full' },
  {
    path: 'admin/assignments',
    component: ShowordersComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/profile',
    component: UserProfileComponent,
    // canActivate: [RoleGuardService],
    // data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/orderdetails/:id',
    component: AssignmentsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/feedbacks',
    component: FeedbacksComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/admin-coupons',
    component: AdminCouponsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/proofReading',
    component: ProofreadingComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/proofReadingdetails/:id',
    component: ProofreadingDetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/usermanagement',
    component: UsermanagementComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/financialreport',
    component: FinancialReportComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/assignment-feedback/:id',
    component: AdminAssignmentFeedbackComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/assignment-clarity/:id',
    component: AdminAssignmentClarityComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'admin/showeditor',
    component: ShowEditorsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'admin' },
  },

  // user
  {
    path: 'user/profile',
    component: UserProfileComponent,
    // canActivate: [RoleGuardService],
    // data: { expectedRole: 'user' },
  },
  {
    path: 'user/plagiarism',
    component: UserPlagiarismComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/proofReading&Editing',
    component: UserProofReadingComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/dashboard',
    component: UserDashboardComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/academicToolkit',
    component: UserAcademicToolkitComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/assignmentAid',
    component: UserAssignmentAidComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/dataAnalysis',
    component: UserDataAnalysisComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/showorder',
    component: UserShoworderComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/showeditor',
    component: UserEditorsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/myscans',
    component: UserMyscanComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/assignment-clarity',
    component: UserExpendedorderComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/orderdetails/:id',
    component: UserMyorderdetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/scanreport/:id',
    component: ScanReportComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/subscriptions',
    component: SubscriptionDetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/dataAnalysisPricing',
    component: UserDataAnylsisPricingComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/billinginfo',
    component: BillingInformationComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/assignmentorder',
    component: ShowAssignmentorderComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/assignment-feedback',
    component: AssignmentFeedbackComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/orderCompletion/:id',
    component: OrderCompletionComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/assignment-clarity/:id',
    component: MyAssignmentComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/assignment-feedback/:id',
    component: AssignmentFeedbackDetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/dataAnalysis',
    component: UserDataAnalysisComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/showorder',
    component: UserShoworderComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/myNotifications',
    component: UserNotificationComponent,
  },
  {
    path: 'user/showeditor',
    component: UserEditorsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/myscans',
    component: UserMyscanComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/assignment-clarity',
    component: UserExpendedorderComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/orderdetails/:id',
    component: UserMyorderdetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/scanreport/:id',
    component: ScanReportComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/subscriptions',
    component: SubscriptionDetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/show-proofReading-details/:id',
    component: ShowProofreadingDetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'user/ai-writing',
    component: AiWritingComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'success',
    component: PaymentSuccessComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },
  {
    path: 'fail',
    component: PaymentFailComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'user' },
  },

  // editor

  {
    path: 'editor/dashboard',
    component: EditorDashboardComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'editor' },
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    // canActivate: [RoleGuardService],
    // data: { expectedRole: 'editor' },
  },
  {
    path: 'editor/proofReading',
    component: ProofreadingEditorComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'editor' },
  },
  {
    path: 'editor/proofReadingEditordetails/:id',
    component: ProofreadingEditordetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'editor' },
  },
  {
    path: 'editor/assignments',
    component: ShowordersComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'editor' },
  },
  {
    path: 'editor/assignment-feedback/:id',
    component: OrderDetailsComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'editor' },
  },
  {
    path: 'editor/assignment-clarity/:id',
    component: EditorAssignmentClarityComponent,
    canActivate: [RoleGuardService],
    data: { expectedRole: 'editor' },
  },

  // common routes
  { path: 'sharereport/:id/:userId', component: ShareReportComponent },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'home', component: HeaderComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'scan-report', component: ScanReportComponent },
  { path: 'callbackss', component: GoogleDriveComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
