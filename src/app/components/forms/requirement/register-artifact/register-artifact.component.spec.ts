import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterArtifactComponent } from './register-artifact.component';

describe('RegisterArtifactComponent', () => {
  let component: RegisterArtifactComponent;
  let fixture: ComponentFixture<RegisterArtifactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterArtifactComponent]
    });
    fixture = TestBed.createComponent(RegisterArtifactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
