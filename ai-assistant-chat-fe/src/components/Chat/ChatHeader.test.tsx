import { render, screen, fireEvent } from "@testing-library/react";
import { ChatHeader } from "./ChatHeader";
import { ThemeProvider } from "../../contexts/ThemeContext";

// Mock the ThemeContext
jest.mock("../../contexts/ThemeContext", () => ({
  useTheme: () => ({
    theme: "light",
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock HeroIcons
jest.mock("@heroicons/react/24/outline", () => ({
  MoonIcon: () => (
    <div className="h-5 w-5" data-testid="moon-icon">
      MoonIcon
    </div>
  ),
  SunIcon: () => (
    <div className="h-5 w-5" data-testid="sun-icon">
      SunIcon
    </div>
  ),
}));

describe("ChatHeader", () => {
  it("renders the header title correctly", () => {
    render(
      <ThemeProvider>
        <ChatHeader />
      </ThemeProvider>
    );

    expect(screen.getByText("Internal AI Dashboard")).toBeInTheDocument();
  });
});
