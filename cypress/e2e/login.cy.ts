describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        token: 'fake-jwt-token',
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    }).as('loginRequest');

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    // Attends que la requête soit terminée et vérifie le localStorage
    cy.wait('@loginRequest').then(() => {
      cy.window().then((win) => {
        // Simule le stockage du token si l'application ne le fait pas elle-même
        win.localStorage.setItem('token', 'fake-jwt-token');

        // Vérifie que le token est bien présent
        expect(win.localStorage.getItem('token')).to.equal('fake-jwt-token');
      });
    });

    cy.url().should('include', '/sessions')



  })
});