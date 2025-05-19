import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Récupération des services injectés
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test de succès de connexion
  it('should handle successful login', () => {
    // Mock des données de test
    const loginRequest = { email: 'test@example.com', password: 'password' };
    const sessionInfo: SessionInformation = {
      token: 'token',
      type: 'type',
      id: 1,
      username: 'user',
      firstName: 'John',
      lastName: 'Doe',
      admin: false
    };

    // Configuration des mocks
    component.form.setValue(loginRequest);
    const authSpy = jest.spyOn(authService, 'login').mockReturnValue(of(sessionInfo));
    const sessionSpy = jest.spyOn(sessionService, 'logIn');
    const routerSpy = jest.spyOn(router, 'navigate');

    // Appel de la méthode à tester
    component.submit();

    // Vérifications
    expect(authSpy).toHaveBeenCalledWith(loginRequest);
    expect(sessionSpy).toHaveBeenCalledWith(sessionInfo);
    expect(routerSpy).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBeFalsy();
  });

  // Test d'échec de connexion
  it('should handle login error', () => {
    // Mock des données de test
    const loginRequest = { email: 'test@example.com', password: 'wrong' };

    // Configuration des mocks pour simuler une erreur
    component.form.setValue(loginRequest);
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Error')));
    const sessionSpy = jest.spyOn(sessionService, 'logIn');
    const routerSpy = jest.spyOn(router, 'navigate');

    // Appel de la méthode à tester
    component.submit();

    // Vérifications
    expect(sessionSpy).not.toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  });

  // Test pour vérifier la validation "required" sur le champ email
  it('should detect email required error', () => {
    // Récupère le contrôle "email" du formulaire
    // form.get() permet d'accéder à un contrôle spécifique du FormGroup
    const emailControl = component.form.get('email');

    //Marque le champ comme "touché" (simule l'interaction utilisateur)
    emailControl?.markAsTouched();

    // Définit une valeur vide pour le champ
    // Simule un utilisateur qui n'a rien saisi
    emailControl?.setValue('');

    // Vérifie que le contrôle a bien l'erreur 'required'
    // hasError() vérifie la présence d'une erreur de validation spécifique
    expect(emailControl?.hasError('required')).toBeTruthy();
  });

  it('should detect password required error', () => {
    const passwordControl = component.form.get('password');
    passwordControl?.markAsTouched();
    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

});
