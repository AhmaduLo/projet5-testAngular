describe('Edit session', () => {
    beforeEach(() => {
        cy.safeRegister().then(() => {
            cy.userLogin();
        });
    });

    it('should show all session and Acount', () => {
        cy.contains('Session on ', { timeout: 10000 }).should('be.visible');
        cy.contains('button', 'Detail').click();
        cy.wait(5000)
        cy.get('button').invoke('text').then((buttonText) => {
            if (buttonText.includes('Participate')) {
                cy.contains('button', 'Participate').click();
                cy.contains('button', 'Do not participate').should('exist');
            } else {
                cy.contains('button', 'Do not participate').click();
                cy.contains('button', 'Participate').should('exist');
            }
        });
        cy.wait(5000)
    })

    it('should delete Acount', () => {
        cy.userLogin();
        cy.contains('Account', { timeout: 10000 }).should('be.visible').click();
        cy.wait(5000)
        cy.contains('Delete my account', { timeout: 10000 }).should('be.visible')
        cy.contains('button', 'Detail').click();
        cy.wait(5000)
    })
})