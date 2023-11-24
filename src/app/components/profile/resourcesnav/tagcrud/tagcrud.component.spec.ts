import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagcrudComponent } from './tagcrud.component';

describe('TagcrudComponent', () => {
  let component: TagcrudComponent;
  let fixture: ComponentFixture<TagcrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagcrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagcrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
