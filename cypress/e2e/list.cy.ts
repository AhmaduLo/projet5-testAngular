describe('Rental list', () => {
    beforeEach(() => {
        cy.login();
    });

    it('should open the create rental form', () => {
        cy.contains('button', 'Create').click();
        cy.url().should('include', '/sessions/create');
        cy.get('input[formControlName=name]').type("Cardio")
        cy.get('input[type="date"]').type('2025-06-15');
        cy.get('mat-select[formControlName="teacher_id"]').click();
        cy.get('mat-option').contains('Jean Dupont').click();
        cy.get('mat-form-field [formControlName="description"]').type("Très pratique et bon pour la santé");
        cy.get('button[type="submit"]').click();

        

    });
});