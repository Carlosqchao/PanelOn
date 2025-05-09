import { TestBed } from '@angular/core/testing';

import { FirestoreInteractableService } from './firestore-interactable.service';

describe('FirestoreInteractableService', () => {
  let service: FirestoreInteractableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreInteractableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
