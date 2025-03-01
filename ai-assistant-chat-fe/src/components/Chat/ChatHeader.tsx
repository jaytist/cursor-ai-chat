import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../../contexts/ThemeContext";

export function ChatHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex justify-between mb-4 border-b border-[var(--color-border)] pb-4 pt-4 px-4 bg-[var(--color-bg-primary)]">
      <h3 className="text-[var(--color-text-primary)] font-medium">
        Internal AI Dashboard
      </h3>
      <div className="flex gap-4">
        <button
          onClick={toggleTheme}
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-1 rounded-md hover:bg-[var(--color-bg-secondary)]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
        <button className="text-[var(--color-text-secondary)] p-1 rounded-md hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
          <span>⚙️</span>
        </button>
      </div>
    </nav>
  );
}
