import { render, screen } from "@testing-library/react";
import ChatInput from "./ChatInput";

describe("ChatInput", () => {
  it("renders the component", () => {
    const mockOnChange = jest.fn();
    const mockOnSend = jest.fn();

    render(<ChatInput value="" onChange={mockOnChange} onSend={mockOnSend} />);

    // Check if the textarea is rendered
    expect(
      screen.getByPlaceholderText("Type a message...")
    ).toBeInTheDocument();

    // Check if the send button is rendered
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
