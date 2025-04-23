import { TestBed } from '@angular/core/testing';
import { PdfStorageServiceService } from './pdf-storage-service.service';


describe('PdfStorageServiceService', () => {
  let service: PdfStorageServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfStorageServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
