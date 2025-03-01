import { render, screen } from "@testing-library/react";
import { ChatSidebar } from "./ChatSidebar";

describe("ChatSidebar", () => {
  const mockProps = {
    sessions: [],
    activeSession: null,
    onSessionSelect: jest.fn(),
    onNewChat: jest.fn(),
    hasSelectedAssistant: true,
    isLoading: false,
  };

  it("renders without crashing", () => {
    render(<ChatSidebar {...mockProps} />);
    expect(screen.getByText("New Chat")).toBeInTheDocument();
  });
});
