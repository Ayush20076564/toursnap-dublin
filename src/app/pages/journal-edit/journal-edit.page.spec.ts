import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JournalEditPage } from './journal-edit.page';

describe('JournalEditPage', () => {
  let component: JournalEditPage;
  let fixture: ComponentFixture<JournalEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(JournalEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
