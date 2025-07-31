import { render, screen } from "@testing-library/react";
import { AuthContext } from "../orugallu-components/AuthContext";
import { MemoryRouter } from "react-router-dom";
import AdminOrdersPage from "./AdminOrdersPage";

test("redirects non-admin users to login", () => {
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: { role: "user" } }}>
        <AdminOrdersPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );
  expect(screen.queryByText(/All Orders/i)).not.toBeInTheDocument();
});