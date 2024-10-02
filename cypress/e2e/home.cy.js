describe('Login and Registration Flow', () => {
  const username = 'A';
  const password = '1';
  const phone = '12';

  it('should attempt login, register if failed, and then login successfully', () => {
    cy.visit('/');
    cy.get('button').contains('Login');
    cy.get('input[placeholder="Name"]').type(username);
    cy.get('input[placeholder="Password"]').type(password);
    cy.contains('button', 'Login').click();

    cy.get('body').then(($body) => {
      if ($body.text().includes("Malumotni tekshirib Boshqatdan urinib ko'ring.")) {
        cy.contains('button', 'Register').click();
        cy.get('input[placeholder="Name"]').type(username);
        cy.get('input[placeholder="Phone Number"]').type(phone);
        cy.get('input[placeholder="Password"]').type(password);
        cy.contains('button', 'Register').click();
        cy.contains("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
      }
      cy.window().then((win) => {
        const loggedInUser = JSON.parse(win.localStorage.getItem('loggedInUser'));
        expect(loggedInUser).to.exist;
        expect(loggedInUser.name).to.equal(username);

        const users = JSON.parse(win.localStorage.getItem('users'));
        expect(users).to.be.an('array');
        expect(users.some(user => user.name === username && user.password === password)).to.be.true;
      });
      cy.url().should('include', '/home');
    });
  });

});
