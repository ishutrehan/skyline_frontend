import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserExpendedorderComponent } from './user-expendedorder.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

describe('UserExpendedorderComponent', () => {
  let component: UserExpendedorderComponent;
  let fixture: ComponentFixture<UserExpendedorderComponent>;

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
        ToastrModule.forRoot(),
      ],
      declarations: [ UserExpendedorderComponent ],
      providers: [FormBuilder,
          { provide: ActivatedRoute, useValue: { snapshot: { url: [{ path: 'assignmentType' }] } } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserExpendedorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    (window as any).StripeCheckout = {
      configure: jasmine.createSpy('configure').and.returnValue({
        open: jasmine.createSpy('open')
      })
    };
  });

  fit('should set pay to 90 (50 + 40) for Urgent urgency and <= 4000 words', () => {

    component.form.wordsforassignments = 4000;
    component.form.urgenecyofassignments = 'Urgent'
    component.handleOneTimePayment();
    expect(component.pay).toBe(90); // 50 + 40
  });

  fit('should set pay to 70 (50 + 20) for Express urgency and <= 4000 words', () => {
    component.form = {
      urgenecyofassignments: 'Express',
      wordsforassignments: 4000,
    };
    component.handleOneTimePayment();
    expect(component.pay).toBe(70);
  });

  fit('should set pay to 50 for Standard urgency and <= 4000 words', () => {
    component.form = {
      urgenecyofassignments: 'Standard',
      wordsforassignments: 4000,
    };
    component.handleOneTimePayment();
    expect(component.pay).toBe(50);
  });


  fit('should set pay to 130 (90 + 40) for Urgent urgency and <= 10000 words', () => {
    component.form = {
      urgenecyofassignments: 'Urgent',
      wordsforassignments: 10000,
    };

    component.handleOneTimePayment();
    expect(component.pay).toBe(130);
  });

  fit('should set pay to 110 (90 + 20) for Express urgency and <= 10000 words', () => {
    component.form = {
      urgenecyofassignments: 'Express',
      wordsforassignments: 10000,
    };

    component.handleOneTimePayment();
    expect(component.pay).toBe(110);
  });

  fit('should set pay to 90 for Standard urgency and <= 10000 words', () => {
    component.form = {
      urgenecyofassignments: 'Standard',
      wordsforassignments: 10000,
    };

    component.handleOneTimePayment();
    expect(component.pay).toBe(90);
  });

  fit('should set pay to 180 (140 + 40) for Urgent urgency and <= 20000 words', () => {
    component.form = {
      urgenecyofassignments: 'Urgent',
      wordsforassignments: 20000,
    };

    component.handleOneTimePayment();
    expect(component.pay).toBe(180);
  });

  fit('should set pay to 160 (140 + 20) for Express urgency and <= 20000 words', () => {
    component.form = {
      urgenecyofassignments: 'Express',
      wordsforassignments: 20000,
    };

    component.handleOneTimePayment();
    expect(component.pay).toBe(160);
  });

  fit('should set pay to 140 for Standard urgency and <= 20000 words', () => {
    component.form = {
      urgenecyofassignments: 'Standard',
      wordsforassignments: 20000,
    };

    component.handleOneTimePayment();
    expect(component.pay).toBe(140);
  });

});
