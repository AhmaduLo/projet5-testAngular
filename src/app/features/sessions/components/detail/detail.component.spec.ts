import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { TeacherService } from 'src/app/services/teacher.service';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;

  //Simule l'utilisateur connecté a un admin 
  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1,
    },
  };

  //Simule les appels API relatifs à une session 
  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(
      of({
        id: 1,
        name: 'Test Session',
        description: 'Desc',
        users: [1],
        teacher_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        date: new Date(),
      })
    ),
    delete: jest.fn().mockReturnValue(of({})),
    participate: jest.fn().mockReturnValue(of(null)),
    unParticipate: jest.fn().mockReturnValue(of(null)),
  };

  //Simule la récupération des détails de l’enseignant
  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(
      of({
        firstName: 'John',
        lastName: 'Doe',
      })
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
      ],
    }).compileComponents();
    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Test chargement des données de session et enseignant
  it('should fetch session and teacher details', () => {
    component['fetchSession']();
    expect(mockSessionApiService.detail).toHaveBeenCalledWith(
      component.sessionId
    );
    expect(component.session).toBeDefined();
    expect(mockTeacherService.detail).toHaveBeenCalledWith('1');
    expect(component.teacher).toBeDefined();
    expect(component.isParticipate).toBe(true);
  });

  //Test participation à une session
  it('should participate in session and refetch', () => {
    const fetchSpy = jest.spyOn(component as any, 'fetchSession');
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalledWith(
      component.sessionId,
      component.userId
    );
    expect(fetchSpy).toHaveBeenCalled();
  });

  //Test désinscription d'une session
  it('should unparticipate in session and refetch', () => {
    const fetchSpy = jest.spyOn(component as any, 'fetchSession');
    component.unParticipate();
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith(
      component.sessionId,
      component.userId
    );
    expect(fetchSpy).toHaveBeenCalled();
  });
});
