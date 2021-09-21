import { TestBed } from '@angular/core/testing';

import { OrderGuardService } from './order-guard.service';

describe('OrderGuardService', () => {
  let service: OrderGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
