import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSubscriptionDialogTestComponent } from './cancel-subscription-dialog-test.component';

describe('CancelSubscriptionDialogTestComponent', () => {
  let component: CancelSubscriptionDialogTestComponent;
  let fixture: ComponentFixture<CancelSubscriptionDialogTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelSubscriptionDialogTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelSubscriptionDialogTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
