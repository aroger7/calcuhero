import { TestBed, inject } from '@angular/core/testing';

import { NumberService } from './number.service';

describe('NumberService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NumberService]
    });
  });

  it('should be created', inject([NumberService], (service: NumberService) => {
    expect(service).toBeTruthy();
  }));
});
