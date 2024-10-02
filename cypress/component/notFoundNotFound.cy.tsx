import React from "react";
import { NotFound } from "../../src/pages/Additions/NotFound/notFound";
import TestWrapper from "./test-wrapper";

describe("<NotFound />", () => {
  it("renders and check text  ", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <TestWrapper>
        <NotFound />
      </TestWrapper>
    );
  });
});
