import { TestBed } from '@angular/core/testing';

import { ProjectsTableService } from './projects-table.service';

describe('ProjectsTableService', () => {
  let service: ProjectsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectsTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
