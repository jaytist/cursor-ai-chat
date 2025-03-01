import { Assistant } from "../../types/types";

interface AssistantCardProps {
  assistant: Assistant;
  isSelected: boolean;
  onSelect: (assistant: Assistant) => void;
}

export function AssistantCard({
  assistant,
  isSelected,
  onSelect,
}: AssistantCardProps) {
  return (
    <div
      className={`bg-gray-900 p-4 rounded-lg cursor-pointer transition-colors ${
        isSelected ? "ring-2 ring-purple-500" : "hover:bg-gray-800"
      }`}
      onClick={() => onSelect(assistant)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 text-purple-500 bg-purple-500/10 p-2 rounded flex items-center justify-center">
          📝
        </div>
        <div>
          <h4 className="text-white font-medium">{assistant.name}</h4>
          <p className="text-gray-400 text-sm">{assistant.description}</p>
          <div className="text-gray-600 text-xs">Model: {assistant.model}</div>
        </div>
      </div>
    </div>
  );
}
