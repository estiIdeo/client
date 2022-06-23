import { TestBed } from '@angular/core/testing';

import { TagFormResolver } from './tag-form.resolver';

describe('TagFormResolver', () => {
  let resolver: TagFormResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TagFormResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
