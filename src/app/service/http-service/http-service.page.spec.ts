import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpServicePage } from './http-service.page';

describe('HttpServicePage', () => {
  let component: HttpServicePage;
  let fixture: ComponentFixture<HttpServicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpServicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpServicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
