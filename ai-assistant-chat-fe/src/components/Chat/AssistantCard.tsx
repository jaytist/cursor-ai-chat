import { Assistant } from "../../types/types";

interface AssistantCardProps {
  assistant?: Assistant;
  isSelected?: boolean;
  onSelect?: (assistant: Assistant) => void;
  isLoading?: boolean;
}

export function AssistantCard({
  assistant,
  isSelected,
  onSelect,
  isLoading = false,
}: AssistantCardProps) {
  if (isLoading) {
    return (
      <div className="bg-[var(--color-bg-primary)] p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--color-bg-secondary)] rounded animate-pulse" />
          <div className="flex-1">
            <div className="h-5 bg-[var(--color-bg-secondary)] rounded w-24 mb-2 animate-pulse" />
            <div className="h-4 bg-[var(--color-bg-secondary)] rounded w-32 mb-2 animate-pulse" />
            <div className="h-3 bg-[var(--color-bg-secondary)] rounded w-20 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-[var(--color-bg-primary)] p-4 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "ring-2 ring-purple-500"
          : "hover:bg-[var(--color-bg-secondary)]"
      }`}
      onClick={() => onSelect?.(assistant!)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 text-purple-500 bg-purple-500/10 p-2 rounded flex items-center justify-center">
          📝
        </div>
        <div>
          <h4 className="text-[var(--color-text-primary)] font-medium">
            {assistant?.name}
          </h4>
          <p className="text-[var(--color-text-secondary)] text-sm">
            {assistant?.description}
          </p>
          <div className="text-[var(--color-text-secondary)] text-xs">
            Model: {assistant?.model}
          </div>
        </div>
      </div>
    </div>
  );
}
