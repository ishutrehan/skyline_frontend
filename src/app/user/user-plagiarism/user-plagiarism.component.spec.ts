import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPlagiarismComponent } from './user-plagiarism.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';

describe('UserPlagiarismComponent', () => {
  let component: UserPlagiarismComponent;
  let fixture: ComponentFixture<UserPlagiarismComponent>;

  beforeEach(async () => {

    const userInfo = { userId: 6 };
    spyOn(Storage.prototype, 'getItem').and.callFake((key) => {
      if (key === 'userInfo') {
        return JSON.stringify(userInfo);
      }
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        RouterTestingModule,
        ToastrModule.forRoot()
      ],
      declarations: [ UserPlagiarismComponent ],
      providers: [FormBuilder]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPlagiarismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // for both ai detection & plagirism detection
  
  fit('should set pay to 16.99 for AI and Plagiarism detection with words <= 7500', () => {
    component.aiContentDetection = true;
    component.plagiarismDetection = true;
    component.chargeForScan(7500);

    expect(component.pay).toBe(16.99);
  });

  fit('should set pay to 26.99 for AI and Plagiarism detection with words between 7501 and 50000', () => {
    component.aiContentDetection = true;
    component.plagiarismDetection = true;
    component.chargeForScan(10000);

    expect(component.pay).toBe(26.99);
  });

  fit('should set pay to 36.99 for AI and Plagiarism detection with words > 50000', () => {
    component.aiContentDetection = true;
    component.plagiarismDetection = true;
    component.chargeForScan(60000);

    expect(component.pay).toBe(36.99);
  });

  // only for Ai Detection

  fit('should set pay to 8.99 for only AI detection with words <= 7500', () => {
    component.aiContentDetection = true;
    component.plagiarismDetection = false;
    component.chargeForScan(5000);

    expect(component.pay).toBe(8.99);
  });

  fit('should set pay to 18.99 for only AI detection with words between 7501 and 50000', () => {
    component.aiContentDetection = true;
    component.plagiarismDetection = false;
    component.chargeForScan(10000);

    expect(component.pay).toBe(18.99);
  });

  fit('should set pay to 28.99 for only AI detection with words > 50000', () => {
    component.aiContentDetection = true;
    component.plagiarismDetection = false;
    component.chargeForScan(60000);

    expect(component.pay).toBe(28.99);
  });

  // only for plagirism detection

  fit('should set pay to 9.99 for only Plagiarism detection with words <= 7500', () => {
    component.aiContentDetection = false;
    component.plagiarismDetection = true;
    component.chargeForScan(5000);

    expect(component.pay).toBe(9.99);
  });

  fit('should set pay to 19.99 for only Plagiarism detection with words between 7501 and 50000', () => {
    component.aiContentDetection = false;
    component.plagiarismDetection = true;
    component.chargeForScan(10000);

    expect(component.pay).toBe(19.99);
  });

  fit('should set pay to 29.99 for only Plagiarism detection with words > 50000', () => {
    component.aiContentDetection = false;
    component.plagiarismDetection = true;
    component.chargeForScan(60000);

    expect(component.pay).toBe(29.99);
  });
});
