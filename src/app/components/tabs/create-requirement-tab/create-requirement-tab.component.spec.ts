import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRequirementTabComponent } from './create-requirement-tab.component';

describe('CreateRequirementTabComponent', () => {
  let component: CreateRequirementTabComponent;
  let fixture: ComponentFixture<CreateRequirementTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateRequirementTabComponent]
    });
    fixture = TestBed.createComponent(CreateRequirementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
