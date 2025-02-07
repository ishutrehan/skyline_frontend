import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProofReadingComponent } from './user-proof-reading.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';

describe('UserProofReadingComponent', () => {
  let component: UserProofReadingComponent;
  let fixture: ComponentFixture<UserProofReadingComponent>;

  beforeEach(async () => {

    const userInfo = { userId: 6 };
    spyOn(Storage.prototype, 'getItem').and.callFake((key) => {
      if (key === 'userInfo') {
        return JSON.stringify(userInfo);
      }
      return null;
    });

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientModule,
        RouterTestingModule,
        FormsModule,
        ToastrModule.forRoot()],

      declarations: [UserProofReadingComponent],
      providers: [FormBuilder]
    })
      .compileComponents();
  });



  beforeEach(() => {
    fixture = TestBed.createComponent(UserProofReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  // advance pack
  fit('should calculate pay correctly when services is "advance", checkbox4 is false, and radioGroup is "today"', () => {
    component.services = 'advance';
    component.checkbox4 = false;
    component.radioGroup = 'today';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.05 + 0.03)));
  });

  fit('should calculate pay correctly when services is "advance", checkbox4 is false, and radioGroup is "tomorrow"', () => {
    component.services = 'advance';
    component.checkbox4 = false;
    component.radioGroup = 'tomorrow';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.05 + 0.02)));
  });

  fit('should calculate pay correctly when services is "advance", checkbox4 is false, and radioGroup is "other"', () => {
    component.services = 'advance';
    component.checkbox4 = false;
    component.radioGroup = 'other';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.05)));
  });

  // basic pack
  fit('should calculate pay correctly when services is "basic", checkbox4 is false, and radioGroup is "today"', () => {
    component.services = 'basic';
    component.checkbox4 = false;
    component.radioGroup = 'today';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.03 + 0.02)));
  });

  fit('should calculate pay correctly when services is "basic", checkbox4 is false, and radioGroup is "tomorrow"', () => {
    component.services = 'basic';
    component.checkbox4 = false;
    component.radioGroup = 'tomorrow';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.03 + 0.01)));
  });

  fit('should calculate pay correctly when services is "basic", checkbox4 is false, and radioGroup is "other"', () => {
    component.services = 'basic';
    component.checkbox4 = false;
    component.radioGroup = 'other';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.03)));
  });

  // advnce with plagirism detection

  fit('should calculate pay correctly when services is "advance", checkbox4 is true, and radioGroup is "today"', () => {
    component.services = 'advance';
    component.checkbox4 = true;
    component.radioGroup = 'today';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.05 + 0.03) + 20));
  });

  fit('should calculate pay correctly when services is "advance", checkbox4 is true, and radioGroup is "tomorrow"', () => {
    component.services = 'advance';
    component.checkbox4 = true;
    component.radioGroup = 'tomorrow';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.05 + 0.02) + 20));
  });

  fit('should calculate pay correctly when services is "advance", checkbox4 is true, and radioGroup is "other"', () => {
    component.services = 'advance';
    component.checkbox4 = true;
    component.radioGroup = 'other';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.05) + 20));
  });

  // basic with plagirism detection


  fit('should calculate pay correctly when services is "basic", checkbox4 is true, and radioGroup is "today"', () => {
    component.services = 'basic';
    component.checkbox4 = true;
    component.radioGroup = 'today';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.03 + 0.02) + 20));
  });

  fit('should calculate pay correctly when services is "basic", checkbox4 is true, and radioGroup is "tomorrow"', () => {
    component.services = 'basic';
    component.checkbox4 = true;
    component.radioGroup = 'tomorrow';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.03 + 0.01) + 20));
  });

  fit('should calculate pay correctly when services is "basic", checkbox4 is true, and radioGroup is "other"', () => {
    component.services = 'basic';
    component.checkbox4 = true;
    component.radioGroup = 'other';
    component.noOFWord = 100;
    component.chargeForScan(100);
    expect(component.pay).toBe(component.roundToTwo(100 * (0.03) + 20));
  });

});
