import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjectTabComponent } from './create-project-tab.component';

describe('CreateProjectComponent', () => {
  let component: CreateProjectTabComponent;
  let fixture: ComponentFixture<CreateProjectTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateProjectTabComponent]
    });
    fixture = TestBed.createComponent(CreateProjectTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
