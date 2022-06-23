import { TestBed } from '@angular/core/testing';

import { TagFormService } from './tag-form.service';

describe('TagFormService', () => {
  let service: TagFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
