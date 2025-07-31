import { render, screen } from "@testing-library/react";
import { AuthProvider } from "./orugallu-components/AuthContext";
import { CartProvider } from "./orugallu-components/CartContext";
import { MemoryRouter } from "react-router-dom";
import App from "./App"; // <-- Use your actual component

test("renders app", async () => {
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
  // ...your assertions...
});
