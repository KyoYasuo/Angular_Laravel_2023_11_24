import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaartistcrudComponent } from './mediaartistcrud.component';

describe('MediaartistcrudComponent', () => {
  let component: MediaartistcrudComponent;
  let fixture: ComponentFixture<MediaartistcrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaartistcrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaartistcrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
