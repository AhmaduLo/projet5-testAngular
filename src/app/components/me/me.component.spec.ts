import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';
import { User } from 'src/app/interfaces/user.interface';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  // Données fictives pour simuler un utilisateur
  const mockUser: User = {
    id: 1,
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    password: 'securepassword',
    admin: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Mocks des méthodes du service UserService
  const mockUserService = {
    getById: jest.fn().mockReturnValue(of(mockUser)),
    delete: jest.fn().mockReturnValue(of({}))
  };

  // Mock du Router Angular pour vérifier les appels à la navigation
  const mockRouter = {
    navigate: jest.fn()
  };

  // Mock de MatSnackBar pour tester l'ouverture des notifications
  const mockMatSnackBar = {
    open: jest.fn()
  };

  // Mock du SessionService avec des données de session et une méthode logOut mockée
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    },
    logOut: jest.fn()
  }
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test que ngOnInit appelle getById du service UserService et assigne bien l’utilisateur
  it('should fetch user data on init', () => {
    component.ngOnInit();
    expect(mockUserService.getById).toHaveBeenCalledWith('1');// Vérifie que getById a été appelé avec l’ID "1"
    expect(component.user).toEqual(mockUser); // Vérifie que le composant a bien reçu les données utilisateur
  });


  // Test de la méthode delete() : supprime utilisateur, affiche notification, logout, et navigation vers la page d’accueil
  it('should delete user, log out, show snackbar and navigate home', () => {
    component.delete();
    expect(mockUserService.delete).toHaveBeenCalledWith('1'); // Vérifie que delete est appelé avec l’ID "1"
    expect(mockMatSnackBar.open).toHaveBeenCalledWith('Your account has been deleted !', 'Close', { duration: 3000 });// Vérifie que la snackbar s’ouvre avec le bon message
    expect(mockSessionService.logOut).toHaveBeenCalled(); // Vérifie que la méthode logOut a été appelée
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']); // Vérifie que la navigation vers "/" a été déclenchée
  });
});
