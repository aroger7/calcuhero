import { TestBed, inject } from '@angular/core/testing';

import { EquationBuilderService } from './equation-builder.service';

describe('EquationBuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EquationBuilderService]
    });
  });

  it('should be created', inject([EquationBuilderService], (service: EquationBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
