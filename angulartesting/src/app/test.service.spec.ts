import { TestBed, inject } from '@angular/core/testing';

import { TestService } from './test.service';
import { ExpectedConditions } from 'protractor';

describe('TestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestService]
    });
  });

  it('should be created', inject([TestService], (service: TestService) => {
    expect(service).toBeTruthy();// you donot expect value to null
  }));

  it('should have add function', 
      inject([TestService], (service:TestService)=>{
        expect(service.add).toBeTruthy();
      }));
  it('should sum to parameter values',
      inject([TestService],(service:TestService)=>{
        expect(service.add(1,2)).toEqual(4)
      })
  )
});
