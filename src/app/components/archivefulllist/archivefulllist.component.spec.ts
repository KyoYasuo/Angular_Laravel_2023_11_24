import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivefulllistComponent } from './archivefulllist.component';

describe('ArchivefulllistComponent', () => {
  let component: ArchivefulllistComponent;
  let fixture: ComponentFixture<ArchivefulllistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivefulllistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivefulllistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
