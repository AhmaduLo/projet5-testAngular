import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    description: 'Description',
    date: new Date(),
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test pour vérifier la récupération de toutes les sessions via la méthode "all"
  it('should get all sessions', () => {
    service.all().subscribe(sessions => {

      // Vérifie que la réponse contient bien 1 session
      expect(sessions.length).toBe(1);

      // Vérifie que le nom de la première session correspond au mock
      expect(sessions[0].name).toBe('Test Session');
    });
    // Attend une requête GET vers 'api/session'
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');// Vérifie que la méthode HTTP est GET
    req.flush([mockSession]);// Simule la réponse HTTP avec le mockSession dans un tableau
  });

  // Test la mise à jour d'une session via la méthode "update"
  it('should update a session', () => {
    service.update('1', mockSession).subscribe(session => {

      // Vérifie que la session renvoyée correspond au mock
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSession);
  });

  // Test la suppression d'une session via la méthode "delete"
  it('should delete a session', () => {
    service.delete('1').subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  // Test la participation d'un utilisateur à une session via "participate"
  it('should participate to a session', () => {
    service.participate('1', '2').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/2');
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  // Test le désabonnement d'un utilisateur via "unParticipate"
  it('should unparticipate from a session', () => {
    service.unParticipate('1', '2').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne('api/session/1/participate/2');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

});
