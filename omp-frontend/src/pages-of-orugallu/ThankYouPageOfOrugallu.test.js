import { render, screen } from "@testing-library/react";
import ThankYouPageOfOrugallu from "./ThankYouPageOfOrugallu";

const mockOrder = {
  orderId: "123",
  customer: { Name: "Test User", Phone: "1234567890" },
  items: [],
};

test("renders thank you heading", async () => {
  render(<ThankYouPageOfOrugallu order={mockOrder} />);
  expect(await screen.findByText(/Your Order is Placed/i)).toBeInTheDocument();
});