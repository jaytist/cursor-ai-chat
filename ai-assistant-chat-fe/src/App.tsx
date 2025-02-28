import React from "react";

function App() {
  return (
    <div className="flex flex-col h-screen bg-gray-950">
      {/* Main container with padding only at top and sides */}
      <div className="flex flex-col h-screen px-8 pt-4">
        {/* Header */}
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

        {/* AI Assistant Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {/* PRD Assistant Card */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 text-purple-500 bg-purple-500/10 p-2 rounded flex items-center justify-center">
                📝
              </div>
              <div>
                <h4 className="text-white font-medium">PRD Assistant</h4>
                <p className="text-gray-400 text-sm">
                  A specialized AI agent for helping
                </p>
                <div className="text-gray-600 text-xs">Model: gpt-4b</div>
              </div>
            </div>
          </div>

          {/* Legal Policy GPT */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 text-blue-500 bg-blue-500/10 p-2 rounded flex items-center justify-center">
                ⚖️
              </div>
              <div>
                <h4 className="text-white font-medium">Legal Policy GPT</h4>
                <p className="text-gray-400 text-sm">
                  An AI Agent to assist with legal topics
                </p>
                <div className="text-gray-600 text-xs">Model: gpt-4b</div>
              </div>
            </div>
          </div>

          {/* General Chat */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 text-green-500 bg-green-500/10 p-2 rounded flex items-center justify-center">
                💬
              </div>
              <div>
                <h4 className="text-white font-medium">General Chat</h4>
                <p className="text-gray-400 text-sm">
                  An AI Assistant for your everyday
                </p>
                <div className="text-gray-600 text-xs">Model: gpt-4b</div>
              </div>
            </div>
          </div>

          {/* Research Assistant */}
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 text-orange-500 bg-orange-500/10 p-2 rounded flex items-center justify-center">
                🔍
              </div>
              <div>
                <h4 className="text-white font-medium">Research Assistant</h4>
                <p className="text-gray-400 text-sm">
                  An AI Agent to assist with research
                </p>
                <div className="text-gray-600 text-xs">Model: gpt-4b</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Layout - Flex container taking remaining height */}
        <div className="flex gap-4 flex-1 mb-0">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 rounded-t-lg flex flex-col">
            <div className="p-3">
              <button className="w-full bg-gray-800 text-white rounded-lg p-2 flex items-center justify-center gap-2">
                <span>+</span> New Chat
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {[
                "New Chat",
                "tell me about this image",
                "PRD Chat",
                "General",
                "Legal",
              ].map((chat, index) => (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-800 cursor-pointer"
                >
                  <div className="text-gray-400 text-sm">{chat}</div>
                  <div className="text-gray-600 text-xs">2/24/2024</div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-gray-900 rounded-t-lg flex flex-col">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* AI Message */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                  AI
                </div>
                <div className="bg-gray-800 rounded-lg p-4 max-w-[80%]">
                  <p className="text-gray-300">
                    Hello! How can I help you today?
                  </p>
                </div>
              </div>

              {/* User Message */}
              <div className="flex items-start gap-4 justify-end">
                <div className="bg-purple-500/10 rounded-lg p-4 max-w-[80%]">
                  <p className="text-gray-300">Hi, I have a question.</p>
                </div>
                <div className="w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-500">
                  U
                </div>
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-800 p-4">
              <div className="max-w-3xl mx-auto relative">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-gray-800 text-gray-300 rounded-lg pl-4 pr-12 py-3"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 hover:text-purple-400">
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
