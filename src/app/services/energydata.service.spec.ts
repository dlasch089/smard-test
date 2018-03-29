import { TestBed, inject } from '@angular/core/testing';

import { EnergydataService } from './energydata.service';

describe('EnergydataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnergydataService]
    });
  });

  it('should be created', inject([EnergydataService], (service: EnergydataService) => {
    expect(service).toBeTruthy();
  }));
});
