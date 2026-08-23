import { useState, useRef, useEffect } from "react";
import { Brain, Send, X, Loader2, Shield } from "lucide-react";
import { useEssai } from "@/hooks/useEssai";

interface EssaiChatProps {
  symbol: string;
  companyName?: string;
  onClose: () => void;
}

const SUGGESTED_QUESTIONS = [
  "What is happening with this stock?",
  "Why is confidence low?",
  "What are the biggest risks?",
  "What does this company actually do?",
  "What should I watch?",
];

export default function EssaiChat({ symbol, companyName, onClose }: EssaiChatProps) {
  const { chatHistory, loadingChat, askEssai, clearChat } = useEssai();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loadingChat) return;
    setInput("");
    await askEssai(symbol, q);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const confidenceColor = (level: string) =>
    level === "HIGH" ? "text-emerald-400" :
    level === "MEDIUM" ? "text-amber-400" :
    level === "LOW" ? "text-orange-400" : "text-zinc-500";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <Brain className="w-4 h-4 text-sky-400" />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-100">ESSAI</div>
            <div className="text-[10px] text-zinc-500 font-mono tracking-widest">
              STOCKSEE INTELLIGENCE · {symbol}{companyName ? ` · ${companyName}` : ""}
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {chatHistory.length > 0 && (
              <button
                onClick={clearChat}
                className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Chat body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="space-y-4">
              <div className="text-center py-4">
                <Brain className="w-10 h-10 text-sky-500/30 mx-auto mb-3" />
                <p className="text-sm text-zinc-400 font-medium">Ask ESSAI about {symbol}</p>
                <p className="text-xs text-zinc-600 mt-1">
                  Evidence-backed analysis. Not financial advice.
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                  Suggested questions
                </div>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => askEssai(symbol, q)}
                    className="w-full text-left text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-sky-500/30 rounded-lg px-3 py-2 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            chatHistory.map((entry, i) => (
              <div key={i} className="space-y-2">
                {/* User question */}
                <div className="flex justify-end">
                  <div className="max-w-xs bg-sky-500/10 border border-sky-500/20 rounded-xl px-4 py-2.5 text-sm text-zinc-200">
                    {entry.question}
                  </div>
                </div>

                {/* ESSAI answer */}
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Brain className="w-3 h-3 text-sky-400" />
                  </div>
                  <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 space-y-2">
                    <p className="text-sm text-zinc-200 leading-relaxed">{entry.answer.answer}</p>

                    {entry.answer.evidence.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-zinc-800">
                        {entry.answer.evidence.map((ev, j) => (
                          <div key={j} className="text-[11px] text-zinc-500 flex gap-1.5">
                            <span className="text-sky-500">·</span>
                            {ev}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      <span className={`text-[10px] font-mono ${confidenceColor(entry.answer.confidence_level)}`}>
                        {entry.answer.confidence_score}% confidence
                      </span>
                      {entry.answer._mode && (
                        <span className="text-[9px] text-zinc-700 uppercase tracking-widest">
                          {entry.answer._mode === "llm" ? "AI" : "Deterministic"}
                        </span>
                      )}
                    </div>

                    {entry.answer.limitations && (
                      <div className="text-[10px] text-zinc-600 italic">{entry.answer.limitations}</div>
                    )}
                    <div className="flex items-center gap-1 text-[9px] text-zinc-700">
                      <Shield className="w-2.5 h-2.5" />
                      {entry.answer.disclaimer}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {loadingChat && (
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-3 h-3 text-sky-400" />
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                <span className="text-xs text-zinc-500 animate-pulse">Analysing evidence…</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-zinc-800">
          <div className="flex gap-2 items-center">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask about ${symbol}…`}
              disabled={loadingChat}
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loadingChat}
              className="w-10 h-10 flex-shrink-0 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-white flex items-center justify-center transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-[9px] text-zinc-700 mt-1.5 text-center">
            Analysis only · Not financial advice · External news treated as untrusted
          </div>
        </div>
      </div>
    </div>
  );
}
