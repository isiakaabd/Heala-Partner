describe("Login User", () => {
  it("passes", () => {
    cy.visit("https://heala-partners.netlify.app/");
    cy.findByRole("textbox", {
      name: /enter your email/i,
    }).type("diagnostics@heala.ng");
    cy.findByPlaceholderText(/enter your password/i).type("43182115");
    cy.findByRole("button", { name: /login/i }).click();
  });
});
