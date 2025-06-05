import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService Integration Tests', () => {
    let service: UserService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        // Configuration du module de test avec HttpClientTestingModule pour mocker les requêtes HTTP
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [UserService]
        });

        // Injection des instances du service et du mock HTTP pour chaque test
        service = TestBed.inject(UserService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifie qu'il n'y a pas de requêtes HTTP non consommées après chaque test
        httpMock.verify();
    });

    it('should fetch user by id via GET request', () => {
        const mockUser: User = {
            id: 123,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            admin: false,
            password: 'hashedPwd',
            createdAt: new Date()
        };

        // Appel de la méthode getById avec un id
        service.getById('123').subscribe(user => {
            // On s'attend à recevoir l'utilisateur mocké
            expect(user).toEqual(mockUser);
        });

        // On attend une requête HTTP GET vers le bon endpoint
        const req = httpMock.expectOne('api/user/123');
        expect(req.request.method).toBe('GET');

        // On simule la réponse HTTP avec le mockUser
        req.flush(mockUser);
    });

    it('should delete user by id via DELETE request', () => {
        // Appel de la méthode delete avec un id
        service.delete('123').subscribe(response => {
            // On s'attend à ce que la réponse soit vide ou quelconque confirmation
            expect(response).toBeTruthy();
        });

        // On attend une requête HTTP DELETE vers le bon endpoint
        const req = httpMock.expectOne('api/user/123');
        expect(req.request.method).toBe('DELETE');

        // On simule la réponse HTTP, ici juste un statut 200 sans contenu
        req.flush({ success: true });
    });
});
