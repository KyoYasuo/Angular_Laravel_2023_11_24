import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcesnavComponent } from './resourcesnav.component';

describe('ResourcesnavComponent', () => {
  let component: ResourcesnavComponent;
  let fixture: ComponentFixture<ResourcesnavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcesnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcesnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
