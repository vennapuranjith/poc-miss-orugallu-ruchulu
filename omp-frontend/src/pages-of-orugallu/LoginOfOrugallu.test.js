import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../orugallu-components/AuthContext";
import { CartProvider } from "../orugallu-components/CartContext";
import { MemoryRouter } from "react-router-dom";
import LoginOfOrugallu from "./LoginOfOrugallu";

test("renders login heading", () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <LoginOfOrugallu />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(screen.getByText(/Login to Miss Orugallu Ruchulu/i)).toBeInTheDocument();
});