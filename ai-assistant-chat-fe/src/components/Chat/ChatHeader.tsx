export function ChatHeader() {
  return (
    <nav className="flex justify-between mb-4 border-b border-gray-800 pb-4">
      <h3 className="text-white">Internal AI Dashboard</h3>
      <div className="flex gap-4">
        <button className="text-gray-400">
          <span>🌟</span>
        </button>
        <button className="text-gray-400">
          <span>⚙️</span>
        </button>
      </div>
    </nav>
  );
}
