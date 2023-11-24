import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcessubcategorycrudComponent } from './resourcessubcategorycrud.component';

describe('ResourcessubcategorycrudComponent', () => {
  let component: ResourcessubcategorycrudComponent;
  let fixture: ComponentFixture<ResourcessubcategorycrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcessubcategorycrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcessubcategorycrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
