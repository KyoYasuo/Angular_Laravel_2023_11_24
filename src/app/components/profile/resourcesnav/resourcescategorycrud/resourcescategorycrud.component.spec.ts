import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcescategorycrudComponent } from './resourcescategorycrud.component';

describe('ResourcescategorycrudComponent', () => {
  let component: ResourcescategorycrudComponent;
  let fixture: ComponentFixture<ResourcescategorycrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcescategorycrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcescategorycrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
