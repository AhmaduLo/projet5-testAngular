import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { SessionApiService } from '../../services/session-api.service';
import { SessionService } from '../../../../services/session.service';
import { TeacherService } from '../../../../services/teacher.service';

// Solution 1: Déclaration globale pour Jest (si nécessaire)
declare global {
    namespace jest {
        interface Matchers<R> {
            toEqual(expected: any): R;
            toHaveBeenCalledWith(...args: any[]): R;
        }
    }
}

describe('FormComponent (integration)', () => {
    let component: FormComponent;
    let fixture: ComponentFixture<FormComponent>;

    // Solution 2: Typage fort des mocks
    let sessionApiServiceMock: {
        create: jest.Mock;
        update: jest.Mock;
        detail: jest.Mock;
    };
    let sessionServiceMock: { sessionInformation: { admin: boolean } };
    let routerMock: { url: string; navigate: jest.Mock };
    let snackBarMock: { open: jest.Mock };

    beforeEach(async () => {
        // Initialisation avec typage explicite
        sessionApiServiceMock = {
            create: jest.fn().mockReturnValue(of({})),
            update: jest.fn().mockReturnValue(of({})),
            detail: jest.fn()
        };

        sessionServiceMock = {
            sessionInformation: { admin: true }
        };

        routerMock = {
            url: '/sessions/create',
            navigate: jest.fn()
        };

        snackBarMock = {
            open: jest.fn()
        };

        await TestBed.configureTestingModule({
            declarations: [FormComponent],
            imports: [ReactiveFormsModule],
            providers: [
                { provide: SessionApiService, useValue: sessionApiServiceMock },
                { provide: SessionService, useValue: sessionServiceMock },
                { provide: Router, useValue: routerMock },
                { provide: MatSnackBar, useValue: snackBarMock },
                { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
                {
                    provide: TeacherService,
                    useValue: { all: () => of([{ id: '1', firstName: 'John', lastName: 'Doe' }]) }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should submit form and call service, navigate, and show snackbar', fakeAsync(() => {
        component.sessionForm?.setValue({
            name: 'Yoga Session',
            date: '2025-06-10',
            teacher_id: '1',
            description: 'A relaxing yoga session'
        });

        fixture.detectChanges();
        component.submit();
        tick();

       
        expect(sessionApiServiceMock.create).toHaveBeenCalledWith({
            name: 'Yoga Session',
            date: '2025-06-10',
            teacher_id: '1',
            description: 'A relaxing yoga session'
        });

        expect(snackBarMock.open).toHaveBeenCalledWith(
            'Session created !',
            'Close',
            { duration: 3000 }
        );

        expect(routerMock.navigate).toHaveBeenCalledWith(['sessions']);

        //  Version avec vérification manuelle (fallback)
        const createCallArgs = sessionApiServiceMock.create.mock.calls[0][0];
        expect(createCallArgs).toMatchObject({
            name: 'Yoga Session',
            teacher_id: '1'
        });
    }));
});