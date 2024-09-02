import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateArtifactFormComponent } from './update-artifact-form.component';

describe('UpdateArtifactFormComponent', () => {
  let component: UpdateArtifactFormComponent;
  let fixture: ComponentFixture<UpdateArtifactFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateArtifactFormComponent]
    });
    fixture = TestBed.createComponent(UpdateArtifactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
