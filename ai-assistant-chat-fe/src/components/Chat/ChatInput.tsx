interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
}

export default function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="border-t bg-white dark:bg-gray-900 p-4">
      <div className="max-w-3xl mx-auto relative">
        <textarea
          value={value}
          onChange={onChange}
          placeholder="Type a message..."
          rows={1}
          className="w-full bg-transparent dark:bg-gray-800 text-gray-900 dark:text-gray-300 rounded-lg pl-4 pr-12 py-3 border-blue-400 dark:border-transparent border resize-y min-h-[52px] max-h-[300px]"
        />
        <button
          onClick={onSend}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-400 text-2xl"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
