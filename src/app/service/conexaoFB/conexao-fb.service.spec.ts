import { TestBed } from '@angular/core/testing';

import { ConexaoFBService } from './conexao-fb.service';

describe('ConexaoFBService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConexaoFBService = TestBed.get(ConexaoFBService);
    expect(service).toBeTruthy();
  });
});
