import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService - Integration Test', () => {
    let service: SessionService;

    beforeEach(() => {
        // Configuration du module de test Angular et injection du service
        TestBed.configureTestingModule({});
        service = TestBed.inject(SessionService);
    });

    it('should start with user logged out', () => {
        // Au démarrage, isLogged est false et sessionInformation undefined
        expect(service.isLogged).toBe(false);
        expect(service.sessionInformation).toBeUndefined();
    });

    it('should update isLogged and sessionInformation on logIn', (done) => {
        // Préparation d'un utilisateur fictif
        const mockUser: SessionInformation = {
            id: 123,
            admin: true,
            firstName: 'John',
            lastName: 'Doe',
            token: 'fake-token',
            type: 'user-type',
            username: 'johndoe'
        };

        // On s'abonne à l'observable $isLogged pour vérifier les changements
        service.$isLogged().subscribe(isLogged => {
            if (isLogged) {
                // Quand isLogged devient true, on vérifie que les données sont bien mises à jour
                expect(service.isLogged).toBe(true);
                expect(service.sessionInformation).toEqual(mockUser);
                done();
            }
        });

        // Appel de la méthode logIn pour changer l'état
        service.logIn(mockUser);
    });

    it('should update isLogged and clear sessionInformation on logOut', (done) => {
        // Connexion d'abord pour avoir un état initial connecté
        const mockUser: SessionInformation = {
            id: 123,
            admin: false,
            firstName: 'Jane',
            lastName: 'Smith',
            token: 'fake-token',
            type: 'user-type',
            username: 'JaneSmith'
        };
        service.logIn(mockUser);

        service.$isLogged().subscribe(isLogged => {
            if (!isLogged) {
                // Quand isLogged devient false, on vérifie que sessionInformation est effacé
                expect(service.isLogged).toBe(false);
                expect(service.sessionInformation).toBeUndefined();
                done();
            }
        });

        // Appel de la méthode logOut pour changer l'état
        service.logOut();
    });
});
