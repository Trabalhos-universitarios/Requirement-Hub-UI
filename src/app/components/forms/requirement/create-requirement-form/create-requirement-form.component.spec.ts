import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequirementFormComponent } from './create-requirement-form.component';

describe('CreateRequirementFormComponent', () => {
  let component: CreateRequirementFormComponent;
  let fixture: ComponentFixture<CreateRequirementFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRequirementFormComponent]
    });
    fixture = TestBed.createComponent(CreateRequirementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
