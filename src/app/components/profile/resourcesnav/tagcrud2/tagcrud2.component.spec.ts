import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tagcrud2Component } from './tagcrud2.component';

describe('Tagcrud2Component', () => {
  let component: Tagcrud2Component;
  let fixture: ComponentFixture<Tagcrud2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tagcrud2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tagcrud2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
