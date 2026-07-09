import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Send, Bot, User, Zap, Activity, TrendingUp, BarChart2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stock-advisor`;

export default function AIAdvisor() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am your AI Copilot. How can I assist you with the markets today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";
    const allMessages = [...messages, userMsg];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("ERR: Auth token missing. Please login.");
      }
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Request failed" }));
        throw new Error(err.error || `ERR: ${resp.status}`);
      }

      if (!resp.body) throw new Error("ERR: No response stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > allMessages.length) {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                }
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : "Error: Unknown exception";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { icon: <Activity size={18} className="text-[var(--blue)]" />, text: "Analyze TSLA's Q3 earnings report" },
    { icon: <TrendingUp size={18} className="text-[var(--blue)]" />, text: "What are the top AI growth stocks?" },
    { icon: <BarChart2 size={18} className="text-[var(--blue)]" />, text: "Compare NIFTY 50 and S&P 500 tech weightage" },
    { icon: <Zap size={18} className="text-[var(--blue)]" />, text: "Scan for RSI oversold large caps" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] relative">
      {/* ── HEADER ── */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2 flex items-center gap-3">
          AI Copilot
          <Sparkles className="text-[var(--blue)] w-6 h-6 animate-pulse" />
        </h1>
        <p className="text-[var(--text-muted)] text-sm tracking-wide">
          Ask anything about stocks, markets, mutual funds, strategy, valuation, risk, or portfolio decisions.
        </p>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden t-panel p-0 relative shadow-2xl">
        
        {messages.length === 1 && (
          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center fade-in">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[var(--blue)] to-[var(--sky)] flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] mb-6 animate-float">
              <Bot size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Good Evening, Essakki 👋</h2>
            <p className="text-[var(--text-muted)] mb-10 text-center max-w-md">
              I'm your intelligent financial advisor. What would you like to explore today?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  onClick={() => send(s.text)}
                  className="glass-panel p-4 cursor-pointer hover:border-[var(--blue)] hover:bg-[rgba(59,130,246,0.05)] transition-all flex items-center gap-4 group"
                >
                  <div className="p-2 rounded-lg bg-[rgba(59,130,246,0.1)] group-hover:bg-[rgba(59,130,246,0.2)] transition-colors">
                    {s.icon}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-1)] group-hover:text-white transition-colors">
                    {s.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.length > 1 && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-4 max-w-4xl mx-auto ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className="flex-shrink-0">
                  {m.role === "assistant" ? (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--blue)] to-[var(--sky)] flex items-center justify-center shadow-lg">
                      <Bot size={20} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-[var(--surface-1)] border border-[var(--border-1)] flex items-center justify-center">
                      <User size={20} className="text-[var(--text-muted)]" />
                    </div>
                  )}
                </div>
                <div 
                  className={`flex-1 px-6 py-4 rounded-2xl ${
                    m.role === "user" 
                      ? "bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] text-[var(--text-1)] rounded-tr-sm" 
                      : "bg-[var(--surface-1)] border border-[var(--border-1)] text-[var(--text-1)] rounded-tl-sm"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm prose-invert max-w-none
                                    [&_p]:leading-relaxed [&_p]:mb-4 last:[&_p]:mb-0
                                    [&_strong]:text-white [&_strong]:font-semibold
                                    [&_h3]:text-[var(--blue)] [&_h3]:font-bold [&_h3]:mb-2 [&_h3]:mt-4
                                    [&_code]:bg-[var(--bg)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:text-[#60A5FA] [&_code]:font-mono [&_code]:text-xs
                                    [&_pre]:bg-[#05070D] [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--border-1)]
                                    [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="leading-relaxed">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-4 max-w-4xl mx-auto">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--blue)] to-[var(--sky)] flex items-center justify-center shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 shimmer" />
                    <Bot size={20} className="text-white relative z-10" />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-[var(--surface-1)] border border-[var(--border-1)] rounded-tl-sm w-32">
                  <div className="w-2 h-2 rounded-full bg-[var(--blue)] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-[var(--blue)] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-[var(--blue)] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}

        {/* ── STICKY INPUT ── */}
        <div className="p-4 md:p-6 border-t border-[var(--border-1)] bg-[var(--bg)]/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto relative flex items-end gap-3 bg-[var(--surface-1)] border border-[var(--border-1)] rounded-2xl p-2 focus-within:border-[var(--blue)] focus-within:ring-1 focus-within:ring-[var(--blue)] transition-all shadow-lg">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Message AI Copilot..."
              disabled={isLoading}
              className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none text-[var(--text-1)] placeholder-[var(--text-muted)] resize-none py-3 px-4 outline-none leading-relaxed"
              rows={1}
            />
            <button
              onClick={() => send(input)}
              disabled={isLoading || !input.trim()}
              className={`p-3 rounded-xl mb-1 mr-1 transition-all flex-shrink-0 ${
                input.trim() && !isLoading
                  ? "bg-[var(--blue)] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:bg-[var(--sky)] transform hover:scale-105"
                  : "bg-[var(--border-1)] text-[var(--text-muted)] cursor-not-allowed"
              }`}
            >
              <Send size={18} className={input.trim() && !isLoading ? "ml-0.5" : ""} />
            </button>
          </div>
          <div className="text-center mt-3">
            <span className="text-[10px] text-[var(--text-muted)] tracking-wide">
              AI can make mistakes. Consider verifying important financial information.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
