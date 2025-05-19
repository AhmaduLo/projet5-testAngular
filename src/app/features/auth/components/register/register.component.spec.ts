import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  const validFormData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'password123'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        NoopAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //La création de compte
  describe('submit', () => {
    it('should call authService.register and navigate to login on success', () => {
      // Mock des données du formulaire
      component.form.setValue(validFormData);

      // Mock du service authService
      const authServiceSpy = jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
      const routerSpy = jest.spyOn(router, 'navigate');

      // Appel de la méthode submit
      component.submit();

      // Vérifications
      expect(authServiceSpy).toHaveBeenCalledWith(validFormData);
      expect(routerSpy).toHaveBeenCalledWith(['/login']);
      expect(component.onError).toBe(false);

    });
  })

  //L’affichage d’erreur en l’absence d’un champ obligatoire
  it('should display email required error', async () => {
    //Remplir le formulaire avec email vide
    component.form.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: '',
      password: 'password123'
    });

    //Forcer la validation
    component.form.get('email')?.markAsTouched();
    component.form.updateValueAndValidity();

    //Détection des changements (2 cycles nécessaires)
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // Vérification
    const emailField = fixture.nativeElement.querySelector('[formControlName="email"]');
    const errorElement = emailField.closest('mat-form-field').querySelector('mat-error');

    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('Email is required');
  });
});

