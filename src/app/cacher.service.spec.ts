import { TestBed, inject } from '@angular/core/testing';

import { CacherService } from './cacher.service';

describe('CacherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CacherService]
    });
  });

  it('should ...', inject([CacherService], (service: CacherService) => {
    expect(service).toBeTruthy();
  }));
});
