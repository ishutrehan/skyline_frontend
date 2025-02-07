import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show-editors',
  templateUrl: './show-editors.component.html',
  styleUrls: ['./show-editors.component.css'],
})
export class ShowEditorsComponent implements OnInit {
  items2: any[] = [];
  visibleItems2: any[] = [];
  baseUrl: string = environment.production;
  myId: any = null;
  itemsPerPage: number = 7;
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize = 2;
  editorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    // Initialize form group with dynamic controls
    this.editorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      academic_level: ['', Validators.required],
      interest: ['', Validators.required],
      city: ['', Validators.required],
      expertise: ['', Validators.required],
      password: ['', Validators.required],
    });
  }
  isLoading: boolean = false;
  ngOnInit(): void {
    let userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      let formatted_data = JSON.parse(userInfo);
      this.myId = formatted_data.userId;
    }
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    // Make HTTP GET request to your API
    this.http
      .get<any>(`${this.baseUrl}/api/showEditors`, {
        params: { pageNo: this.currentPage },
      })
      .subscribe((res: any) => {
        console.log(res.ediotrs, 'editors is there');
        this.items2 = res.editors;
        this.updateVisibleItems2();
        this.isLoading = false;
      });
  }

  private updateVisibleItems2(): void {
    this.visibleItems2 = this.items2.slice(0, 5);
  }

  // update section
  UpdateData = {
    userId: '',
    name: '',
    email: '',
    expertise: '',
    city: '',
    interest: '',
    academic_level: '',
    accountStatus:''
  };

  UpdateModal: boolean = false;

  toggleModalOpen(editor?: any) {
    if (editor) {
      console.log('Selected Editor:', editor);
      this.UpdateData = {
        userId: editor.userId, // Set userId from selected editor
        name: editor.name,
        email: editor.email,
        expertise: editor.expertise,
        city: editor.city,
        interest: editor.interest,
        academic_level: editor.academic_level,
        accountStatus:editor.accountStatus
      };
      console.log('UpdateData before modal open:', this.UpdateData);
    }
    this.UpdateModal = !this.UpdateModal;
  }

  updateEditor() {
    const { userId, name, email, expertise, city, interest, academic_level,accountStatus } =
      this.UpdateData;

    if (!userId) {
      console.error('User ID is missing. Cannot update editor.');
      return;
    }
    if (name && email && academic_level) {
      this.http
        .put(`${this.baseUrl}/api/updateEditors`, {
          userId,
          name,
          email,
          expertise,
          city,
          interest,
          academic_level,
          accountStatus,
          admin: this.myId,
        })
        .subscribe({
          next: (res: any) => {
            this.toastr.success('Editor Details updated successfully');
            console.log('User update successful');
            this.fetchData(); // Refresh data after update
            this.UpdateModal = false;
          },
          error: (err: any) => {
            this.toastr.warning(err.error.message);
          },
        });
    } else {
      this.toastr.warning(" * Feilds can't be empty");
    }
  }

  cancleButton() {
    this.UpdateModal = false;
  }

  // Pagination Methods
  onPrevious() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchData();
    }
  }

  onNext() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchData();
    }
  }

  setPage(page: number) {
    if (page === -1) return; // Ignore ellipsis clicks
    this.currentPage = page;
    this.fetchData();
  }

  // Generate the page numbers to show in pagination
  getPagesToShow(): number[] {
    const pages = [];
    const lastPage = this.totalPages;

    // Always include the first page
    pages.push(1);

    let startPage = Math.max(2, this.currentPage); // Start from currentPage or 2
    let endPage = startPage + 1; // Ensure we show two middle pages

    // Adjust start and end when near the end of the page range
    if (endPage >= lastPage - 2) {
      startPage = lastPage - 3;
      endPage = lastPage - 1;
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < lastPage) {
        pages.push(i);
      }
    }

    // Always add ellipsis in the second last position
    if (lastPage > 3) {
      pages.push(-1); // Ellipsis
    }

    // Always include the last page
    pages.push(lastPage);
    if (pages[1] < 2) {
      pages.length = 1;
    }
    return pages;
  }

  showModal: boolean = false;
  handleAddEditor() {}
  toggleModal() {
    this.showModal = !this.showModal;
  }

  // Handle form submission
  onSubmit() {
    console.log(this.editorForm.valid, 'this.editorForm.valid');
    if (this.editorForm.valid) {
      const {
        academic_level,
        city,
        email,
        expertise,
        interest,
        name,
        password,
      } = this.editorForm.value;
      if (name && email && academic_level) {
        this.http
          .post(`${this.baseUrl}/api/admin/addEditorByAdmin`, {
            name,
            email,
            academic_level,
            interest,
            city,
            expertise,
            pass: password,
            admin: this.myId,
          })
          .subscribe((res: any) => {
            console.log(res, 'res is');
            this.toastr.success('Editor created successfully');
            this.editorForm.reset();
            this.toggleModal();
            this.fetchData();
          });
      }
    } else {
      this.toastr.warning(" * Feilds can't be empty");
    }
  }

  // eye button on password

  show: boolean = false;

  togglePasswordVisibility(): void {
    this.show = !this.show;
  }
}
