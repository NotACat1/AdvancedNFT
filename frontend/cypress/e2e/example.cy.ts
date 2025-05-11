describe('Example Test', () => {
  it('should visit the app and check the title', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Welcome to Redux App').should('exist');
  });
});
