import { useState } from "react";
import type { FormEvent } from "react";
import AppLayout from "../layouts/AppLayout";
import { sendAIMessage } from "../services/aiAssistantService";

type Message = {
  id: string;
  sender: "ai" | "user";
  text: string;
};

function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text:
        "Hello! I'm your Recovery+ AI Assistant. I'm here to support you, help you understand your progress, and guide you through your recovery journey.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const suggestedPrompts = [
    "Help me understand my recovery progress",
    "What should I focus on today?",
    "Help me with one of my goals",
    "Give me some encouragement",
  ];

  async function sendMessage(
    messageText: string
  ) {
    const text = messageText.trim();

    if (!text || isLoading) {
      return;
    }

    setError("");

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: "user",
      text,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const result = await sendAIMessage(text);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: result.response,
      };

      setMessages((current) => [
        ...current,
        aiMessage,
      ]);
    } catch (error) {
      console.error(
        "AI Assistant request failed:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to contact the AI Assistant."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            🤖 Recovery+ AI Assistant
          </h1>

          <p className="mt-2 text-slate-500">
            Your personal recovery support companion.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-3xl">
              🤖
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recovery+ Assistant
              </h2>

              <p className="text-sm text-emerald-600">
                ● Ready to support you
              </p>
            </div>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-2">
            {suggestedPrompts.map(
              (prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() =>
                    void sendMessage(prompt)
                  }
                  disabled={isLoading}
                  className="rounded-xl border border-slate-200 p-4 text-left text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              )
            )}
          </div>

          <div className="mb-6 min-h-[300px] space-y-4 overflow-y-auto rounded-2xl bg-slate-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-blue-700 text-white"
                      : "bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  Recovery+ Assistant is thinking...
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              disabled={isLoading}
              placeholder="Ask your Recovery+ Assistant..."
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 disabled:bg-slate-100"
            />

            <button
              type="submit"
              disabled={
                isLoading ||
                !input.trim()
              }
              className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "Sending..."
                : "Send"}
            </button>
          </form>
        </div>

        <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          Recovery+ AI provides supportive guidance and is not a substitute for professional medical or emergency care.
        </div>
      </div>
    </AppLayout>
  );
}

export default AIAssistant;