import React from "react";
import { MemoryRouter } from "react-router-dom";

const TestWrapper = ({ children }) => {
  return <MemoryRouter>{children}</MemoryRouter>;
};

export default TestWrapper;
