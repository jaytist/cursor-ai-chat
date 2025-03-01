import { render } from "@testing-library/react";
import { ChatArea } from "./ChatArea";
// Mock react-markdown module
jest.mock("react-markdown", () => {
  return ({ children }: { children: string }) => <div>{children}</div>;
});

// Mock rehype-highlight module
jest.mock("rehype-highlight", () => {
  return () => {};
});
describe("ChatArea", () => {
  const mockProps = {
    chats: [],
    isAIResponding: false,
    userMessage: "",
    onUserMessageChange: jest.fn(),
    onSendMessage: jest.fn(),
    isLoadingMessages: false,
  };

  it("renders without crashing", () => {
    expect(() => render(<ChatArea {...mockProps} />)).not.toThrow();
  });
});
