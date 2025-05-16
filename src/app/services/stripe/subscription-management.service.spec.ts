import { TestBed } from '@angular/core/testing';

import { SubscriptionManagementService } from './subscription-management.service';

describe('SubscriptionManagementService', () => {
  let service: SubscriptionManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
