import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService Integration Tests', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        // Configuration du module de test avec HttpClientTestingModule
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });

        // Injection du service et du mock HTTP
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        // Vérifie qu’il n’y a pas de requêtes HTTP non consommées après chaque test
        httpMock.verify();
    });

    it('should register a user by calling POST api/auth/register', () => {
        const mockRegisterRequest: RegisterRequest = {
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User'
        };

        // Appel de la méthode register du service
        service.register(mockRegisterRequest).subscribe(response => {
            // On attend une réponse vide (void)
            expect(response).toBeUndefined();
        });

        // On attend une requête POST vers le bon endpoint
        const req = httpMock.expectOne('api/auth/register');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockRegisterRequest);

        // On simule la réponse du backend avec un status 200 et pas de contenu
        req.flush(null);
    });

    it('should login a user and return session information from api/auth/login', () => {
        const mockLoginRequest: LoginRequest = {
            email: 'test@example.com',
            password: 'password123'
        };

        const mockSessionInformation: SessionInformation = {
            id: 1,
            admin: false,
            firstName: 'John',
            lastName: 'Doe',
            token: 'fake-jwt-token',
            type: 'user',
            username: 'testuser'
        };

        // Appel de la méthode login
        service.login(mockLoginRequest).subscribe(sessionInfo => {
            // On vérifie que la réponse correspond au mock
            expect(sessionInfo).toEqual(mockSessionInformation);
        });

        // On attend une requête POST vers le bon endpoint
        const req = httpMock.expectOne('api/auth/login');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(mockLoginRequest);

        // On simule la réponse du backend avec le mockSessionInformation
        req.flush(mockSessionInformation);
    });
});
