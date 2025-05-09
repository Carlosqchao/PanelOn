import { TestBed } from '@angular/core/testing';

import { DiscussionsService } from './discussions.service';

describe('DiscussionsService', () => {
  let service: DiscussionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiscussionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
