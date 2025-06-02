// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })


// Commande pour l'admin (yoga@studio.com)
Cypress.Commands.add('login', () => {
  cy.visit('/login');
  cy.get('input[formControlName=email]').type("yoga@studio.com");
  cy.get('input[formControlName=password]').type("test!1234", { log: false });
  cy.get('button[type=submit]').click();
  cy.url().should('include', '/sessions');

});

//------------creer un compte----------------------
Cypress.Commands.add('safeRegister', () => {
  cy.visit('/register');

  cy.get('input[formControlName=firstName]').type('gaye');
  cy.get('input[formControlName=lastName]').type('gaye');
  cy.get('input[formControlName=email]').type('gaye@gmail.com');
  cy.get('input[formControlName=password]').type('gaye123', { log: false });

  cy.get('button[type=submit]').click();

  // Attendre la navigation ou une erreur
  cy.get('body').then($body => {
    if ($body.text().includes('An error occurred')) {
      cy.log('Utilisateur déjà existant, on se connecte.');
      cy.userLogin();
    } else {
      cy.url().should('include', '/login'); // Confirme que l’inscription a fonctionné
      cy.log('Inscription réussie, on se connecte.');
      cy.userLogin();
    }
  });
});
;

// Commande pour l'utilisateur standard (gaye@gmail.com)
Cypress.Commands.add('userLogin', () => {
  cy.visit('/login');
  cy.get('input[formControlName=email]').type("gaye@gmail.com");
  cy.get('input[formControlName=password]').type("gaye123", { log: false });
  cy.get('button[type=submit]').click();
  cy.url().should('include', '/sessions');

});