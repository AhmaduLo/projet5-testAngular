describe('Edit session', () => {
    beforeEach(() => {
        cy.login();
    });

    it('should open the edit', () => {
        cy.contains('button', 'edit').click();
        cy.get('input[formControlName="name"]').clear();
        cy.get('input[formControlName=name]').type("Cardio")
        cy.get('input[type="date"]').type('2025-06-10');
        cy.wait(3000)
        cy.get('button[type="submit"]').click();
    })

    it('should open detail and delete session ', () => {
        cy.contains('button', 'Detail').click();
        cy.contains('Cardio', { timeout: 10000 }).should('be.visible');
        cy.contains('Jean DUPONT', { timeout: 10000 }).should('be.visible');
        cy.wait(3000)
        cy.contains('button', 'Delete').click();
        cy.wait(5000)
    })

    it('should open Account ', () => {
        cy.contains('Account', { timeout: 10000 }).should('be.visible').click();
        cy.contains('You are admin', { timeout: 10000 }).should('be.visible')
        cy.wait(5000)
    })

    it('should Logout ', () => {
        cy.contains('Logout', { timeout: 10000 }).should('be.visible').click();
    })

})
