import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../orugallu-components/AuthContext";
import { CartProvider } from "../orugallu-components/CartContext";
import { MemoryRouter } from "react-router-dom";
import MyOrdersOfOrugallu from "./MyOrdersOfOrugallu";

test("renders My Orders heading", async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <MyOrdersOfOrugallu />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  expect(await screen.findByText(/My Orders/i)).toBeInTheDocument();
});