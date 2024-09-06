import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRequirementFormComponent } from './update-requirement-form.component';

describe('UpdateRequirementFormComponent', () => {
  let component: UpdateRequirementFormComponent;
  let fixture: ComponentFixture<UpdateRequirementFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateRequirementFormComponent]
    });
    fixture = TestBed.createComponent(UpdateRequirementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
