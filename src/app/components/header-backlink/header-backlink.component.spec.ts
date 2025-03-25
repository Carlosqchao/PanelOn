import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderBacklinkComponent } from './header-backlink.component';

describe('HeaderBacklinkComponent', () => {
  let component: HeaderBacklinkComponent;
  let fixture: ComponentFixture<HeaderBacklinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderBacklinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderBacklinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
