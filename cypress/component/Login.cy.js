const cy = require("cypress");

describe("Login User", () => {
  it("login user", () => {
    cy.mount();
    // cy.visit("/");
    cy.findByRole("textbox", {
      name: /enter your email/i,
    }).type("diagnostics@heala.ng");
    cy.findByPlaceholderText(/enter your password/i).type("43182115");
    cy.findByRole("button", { name: /login/i }).click();
  });
});
