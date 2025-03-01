import { render, screen } from "@testing-library/react";
import ChatMessage from "./ChatMessage";

// Mock react-markdown module
jest.mock("react-markdown", () => {
  return ({ children }: { children: string }) => <div>{children}</div>;
});

// Mock rehype-highlight module
jest.mock("rehype-highlight", () => {
  return () => {};
});

describe("ChatMessage", () => {
  it("renders AI message correctly", () => {
    render(<ChatMessage type="ai" content="Hello, I'm an AI" />);

    expect(screen.getByText("AI")).toBeInTheDocument();
    expect(screen.getByText("Hello, I'm an AI")).toBeInTheDocument();
  });

  it("renders user message correctly", () => {
    render(<ChatMessage type="user" content="Hello, AI!" />);

    expect(screen.getByText("U")).toBeInTheDocument();
    expect(screen.getByText("Hello, AI!")).toBeInTheDocument();
  });

  it("renders loading state correctly", () => {
    const { container } = render(
      <ChatMessage type="ai" content="" isLoading={true} />
    );

    // Check if loading animation elements are present
    expect(
      container.getElementsByClassName("animate-pulse").length
    ).toBeGreaterThan(0);
  });
});
