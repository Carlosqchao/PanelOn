import { TestBed } from '@angular/core/testing';

import { FirestoreStaticService } from './firestore-static.service';

describe('FirestoreStaticService', () => {
  let service: FirestoreStaticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreStaticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
