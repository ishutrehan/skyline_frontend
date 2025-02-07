import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../firebaseConfig/services/auth.services';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  avatarAlt: string = 'Avatar';
  s1Src: string = 'assets/image/sidebar12.png';
  s2Src: string = 'assets/image/sidebar2.png';
  s3Src: string = 'assets/image/sidebar3.png';
  s4Src: string = 'assets/image/sidebar4.png';
  s5Src: string = 'assets/image/sidebar5.png';
  s6Src: string = 'assets/image/sidebar3.png';
  s7Src: string = 'assets/image/sidebar1.png';
  c1Src: string = 'assets/image/coupon.png';
  c2Src: string = 'assets/image/coupon2.png';

  s8Src: string = 'assets/image/sidebar6.png';
  s9Src: string = 'assets/image/sidebar7.png';
  s10Src: string = 'assets/image/sidebar8.png';
  s11Src: string = 'assets/image/sidebar9.png';
  s13Src: string = 'assets/image/sidebar10.png';
  slSrc: string = 'assets/image/svl.png';

  saSrc: string = 'assets/image/financial1.png';
  sa1Src: string = 'assets/image/financial.png';
  sa2Src: string = 'assets/image/feedback1.png';
  sa21Src: string = 'assets/image/feedback.png';
  sa3Src: string = 'assets/image/management1.png';
  sa31Src: string = 'assets/image/management.png';
  sa4Src: string = 'assets/image/orders1.png';
  sa41Src: string = 'assets/image/orders.png';
  sa5Src: string = 'assets/image/security1.png';
  sa51Src: string = 'assets/image/security.png';
  sa6Src: string = 'assets/image/user-edit1.png';
  sa61Src: string = 'assets/image/user-edit.png';
  sa7Src: string = 'assets/image/assiment1.png';
  sa71Src: string = 'assets/image/assiment.png';

  accountType: string = '';
  scanId: any = '';

  constructor(
    private http: HttpClient,
    public firebaseServices: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}
  @Input() sidebarmodel!: boolean;
  ngOnInit(): void {
    this.scanId = this.route.snapshot.paramMap.get('id');

    const userData = localStorage.getItem('userInfo');
    const user = userData ? JSON.parse(userData) : null;
    if (user && user.accountType) {
      this.accountType = user.accountType;
    }
  }

  logout() {
    localStorage.removeItem('userInfo');
    sessionStorage.removeItem('userInfo');
    this.firebaseServices.onSignOut();
    this.toastr.success('logout successful');
    this.router.navigate(['/signin']);
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  items = [
    {
      label: 'Dashboard',
      imageUrl: 'assets/image/sidebar1.png',
    },
    {
      label: 'Plagiarism and AI Detection',
      imageUrl: 'assets/image/sidebar2.png',
    },
    {
      label: 'Proofreading and Editing',
      imageUrl: 'assets/image/sidebar3.png',
    },
    { label: 'Academic Toolkit', imageUrl: 'assets/image/sidebar4.png' },
    { label: 'Assignment Aid', imageUrl: 'assets/image/sidebar5.png' },
    { label: 'Data Analysis', imageUrl: 'assets/image/sidebar3.png' },
  ];
  selectedItemIndex = 0;

  showModal2: boolean = false;
  toggleModal2() {
    this.showModal2 = !this.showModal2;
  }
}
