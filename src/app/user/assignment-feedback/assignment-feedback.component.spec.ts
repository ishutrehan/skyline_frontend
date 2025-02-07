import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentFeedbackComponent } from './assignment-feedback.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

describe('AssignmentFeedbackComponent', () => {
  let component: AssignmentFeedbackComponent;
  let fixture: ComponentFixture<AssignmentFeedbackComponent>;

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

      declarations: [ AssignmentFeedbackComponent ],
       providers: [FormBuilder,
          { provide: ActivatedRoute, useValue: { snapshot: { url: [{ path: 'assignmentType' }] } } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // words are less than to 4000.

  fit('should set pay to 120 for Urgent urgency and <= 4000 words', () => {
    component.form = { urgenecyofassignments: 'Urgent' };
    component.chargeForScan(4000);
    expect(component.pay).toBe(120); // 70 + 50
  });

  fit('should set pay to 100 for Express urgency and <= 4000 words', () => {
    component.form = { urgenecyofassignments: 'Express' };
    component.chargeForScan(4000);
    expect(component.pay).toBe(100); // 70 + 30
  });

  fit('should set pay to 70 for Standard urgency and <= 4000 words', () => {
    component.form = { urgenecyofassignments: 'Standard' };
    component.chargeForScan(4000);
    expect(component.pay).toBe(70); // 70
  });

  // words are greater than 4000 to 10000.

  fit('should set pay to 185 for Urgent urgency and <= 10000 words', () => {
    component.form = { urgenecyofassignments: 'Urgent' };
    component.chargeForScan(9000);
    expect(component.pay).toBe(185); // 135 + 50
  });

  fit('should set pay to 165 for Express urgency and <= 10000 words', () => {
    component.form = { urgenecyofassignments: 'Express' };
    component.chargeForScan(5000);
    expect(component.pay).toBe(165); // 135 + 30
  });

  fit('should set pay to 135 for Standard urgency and <= 10000 words', () => {
    component.form = { urgenecyofassignments: 'Standard' };
    component.chargeForScan(6000);
    expect(component.pay).toBe(135); // 135
  });

  // words are greater than between 10000 to 20000.

  fit('should set pay to 250 for Urgent urgency and between 10001 and 20000 words', () => {
    component.form = { urgenecyofassignments: 'Urgent' };
    component.chargeForScan(10001);
    expect(component.pay).toBe(250); // 200 + 50
  });

  fit('should set pay to 230 for Express urgency and between 10001 and 20000 words', () => {
    component.form = { urgenecyofassignments: 'Express' };
    component.chargeForScan(15001);
    expect(component.pay).toBe(230); // 200 + 30
  });

  fit('should set pay to 200 for Standard urgency an between 10001 and 20000 words', () =>{
    component.form = { urgenecyofassignments: 'Standard' };
    component.chargeForScan(19999);
    expect(component.pay).toBe(200) //200
  })


});
