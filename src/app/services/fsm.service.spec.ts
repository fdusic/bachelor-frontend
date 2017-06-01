import { TestBed, inject } from '@angular/core/testing';

import { FSMService } from './fsm.service';

describe('FSMService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FSMService]
    });
  });

  it('should be created', inject([FSMService], (service: FSMService) => {
    expect(service).toBeTruthy();
  }));
});
