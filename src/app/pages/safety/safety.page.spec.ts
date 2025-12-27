import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafetyPage } from './safety.page';

describe('SafetyPage', () => {
  let component: SafetyPage;
  let fixture: ComponentFixture<SafetyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
