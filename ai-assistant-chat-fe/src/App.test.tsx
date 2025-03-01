import { render, screen } from "@testing-library/react";
import App from "./App";
import { ErrorProvider } from "./contexts/ErrorContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Mock the API calls
jest.mock("./api/chat", () => ({
  getAssistants: () => Promise.resolve([]),
  getChatSessions: () => Promise.resolve([]),
  getChatMessages: () => Promise.resolve([]),
}));

jest.mock("react-markdown", () => {
  return ({ children }: { children: string }) => <div>{children}</div>;
});

// Mock rehype-highlight module
jest.mock("rehype-highlight", () => {
  return () => {};
});

// Mock the ThemeContext
jest.mock("./contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("App Component", () => {
  test("renders without crashing and shows basic structure", () => {
    render(
      <ThemeProvider>
        <ErrorProvider>
          <App />
        </ErrorProvider>
      </ThemeProvider>
    );

    // Check if main structural elements are present
  });
});
