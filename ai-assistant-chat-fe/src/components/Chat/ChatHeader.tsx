import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";

export function ChatHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex justify-between mb-4 border-b border-[var(--color-border)] pb-4">
      <h3 className="text-[var(--color-text-primary)]">
        Internal AI Dashboard
      </h3>
      <div className="flex gap-4">
        <button
          onClick={toggleTheme}
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
        <button className="text-[var(--color-text-secondary)]">
          <span>⚙️</span>
        </button>
      </div>
    </nav>
  );
}
