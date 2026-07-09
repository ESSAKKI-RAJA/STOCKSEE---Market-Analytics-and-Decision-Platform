import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Globe, Youtube, ExternalLink, Download, Play,
  Search, Bookmark, GraduationCap, ArrowUpRight, Check, BrainCircuit
} from "lucide-react";

import { ebooks } from "@/data/ebooks";
import { platforms } from "@/data/learningPlatforms";
import { channels } from "@/data/youtubeChannels";

const TABS = [
  { id: "ebooks",    label: "Intelligence Briefs",       icon: BookOpen },
  { id: "platforms", label: "Masterclass Access",  icon: Globe },
  { id: "youtube",   label: "Video Analysis",    icon: Youtube },
] as const;

type TabId = (typeof TABS)[number]["id"];

/* ─────────────────────── SUB-COMPONENTS ─────────────────────── */

export default function InsightsHub() {
  const [activeTab, setActiveTab] = useState<TabId>("ebooks");
  const [search, setSearch] = useState("");
  const [savedItems, setSavedItems] = useState<string[]>([]);

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(i => i !== id));
    } else {
      setSavedItems([...savedItems, id]);
    }
  };

  const isSaved = (id: string) => savedItems.includes(id);

  const filteredEbooks = ebooks.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.desc.toLowerCase().includes(search.toLowerCase()));
  const filteredPlatforms = platforms.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));
  const filteredChannels = channels.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 pb-12 w-full animate-fade-in-up">

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative pb-4 border-b border-border">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-purple-accent/10 border border-purple-accent/20 flex items-center justify-center shadow-inner">
            <BrainCircuit className="w-6 h-6 text-purple-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight mb-1">Intelligence Hub</h1>
            <p className="text-text-muted text-sm font-medium">
              Curated masterclasses, insights, and algorithmic playbooks.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Tabs */}
      <div className="bg-card-surface border border-border rounded-2xl shadow-sm relative z-10 flex flex-col p-4 gap-4">
        <div className="relative group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted group-focus-within:text-purple-accent transition-colors" />
          <input
            type="text"
            placeholder={`Search ${activeTab.replace('platforms', 'masterclasses').replace('ebooks', 'briefs').replace('youtube', 'analysis')}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-secondary border border-border rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-muted outline-none focus:border-purple-accent/50 focus:ring-1 focus:ring-purple-accent/50 transition-all font-medium text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSearch(""); }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-purple-accent/10 text-purple-accent border border-purple-accent/20 shadow-sm"
                    : "bg-transparent text-text-muted border border-transparent hover:bg-bg-secondary hover:text-text-primary"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "ebooks" && (
          <motion.div
            key="ebooks"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {filteredEbooks.map((item, i) => (
              <a
                key={item.id}
                href={item.url} target="_blank" rel="noopener noreferrer"
                className="bg-card-surface border border-border p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-purple-accent/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.08)] transition-all relative overflow-hidden"
              >
                <div className="flex items-start gap-4 relative z-10 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-border flex items-center justify-center flex-shrink-0 group-hover:border-purple-accent/30 group-hover:bg-purple-accent/5 transition-colors shadow-sm">
                    <BookOpen className="w-5 h-5 text-purple-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-text-primary text-base mb-1 group-hover:text-purple-accent transition-colors leading-tight">{item.title}</h3>
                    <p className="text-xs text-text-muted leading-relaxed font-medium line-clamp-2">{item.desc}</p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-purple-accent tracking-widest uppercase bg-purple-accent/10 border border-purple-accent/20 px-2 py-0.5 rounded shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative z-10 w-full sm:w-auto mt-2 sm:mt-0">
                  <button 
                    onClick={(e) => toggleSave(item.id, e)}
                    className={`p-2.5 rounded-lg border transition-all shadow-sm ${
                      isSaved(item.id) 
                        ? "bg-green-gain/10 border-green-gain/20 text-green-gain" 
                        : "bg-bg-secondary border-border text-text-muted hover:text-purple-accent hover:border-purple-accent/30"
                    }`}
                  >
                    {isSaved(item.id) ? <Check size={16} /> : <Bookmark size={16} />}
                  </button>
                  <div className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold bg-bg-secondary border border-border text-text-primary hover:bg-purple-accent hover:border-purple-accent hover:text-white transition-all shadow-sm">
                    {item.cta.includes("Download") ? <Download size={14} /> : <BookOpen size={14} />}
                    {item.cta.replace('📥 ', '')}
                  </div>
                </div>
              </a>
            ))}
            {filteredEbooks.length === 0 && <div className="col-span-full text-center py-12 text-text-muted bg-card-surface border border-border rounded-2xl font-bold">No intelligence briefs found.</div>}
          </motion.div>
        )}

        {activeTab === "platforms" && (
          <motion.div
            key="platforms"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredPlatforms.map((item, i) => (
              <a
                key={item.id}
                href={item.url} target="_blank" rel="noopener noreferrer"
                className="bg-card-surface border border-border rounded-2xl p-6 flex flex-col gap-4 group hover:border-blue-accent/50 hover:shadow-[0_8px_30px_rgba(37,99,255,0.08)] transition-all relative overflow-hidden"
              >
                {item.featured && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-accent opacity-10 blur-[40px] pointer-events-none" />
                )}
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-bg-secondary border border-border flex items-center justify-center group-hover:border-blue-accent/30 group-hover:bg-blue-accent/5 transition-colors shadow-sm">
                    <Globe className="w-6 h-6 text-blue-accent" />
                  </div>
                  <button 
                    onClick={(e) => toggleSave(item.id, e)}
                    className={`p-2 rounded-lg transition-colors border shadow-sm ${isSaved(item.id) ? "bg-green-gain/10 border-green-gain/20 text-green-gain" : "bg-bg-secondary border-border text-text-muted hover:text-blue-accent hover:border-blue-accent/30"}`}
                  >
                    {isSaved(item.id) ? <Check size={16} /> : <Bookmark size={16} />}
                  </button>
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="font-heading font-bold text-text-primary text-lg mb-2 group-hover:text-blue-accent transition-colors leading-tight">{item.name}</h3>
                  <span className="inline-block mb-3 text-[10px] font-bold text-blue-accent tracking-widest uppercase bg-blue-accent/10 border border-blue-accent/20 px-2 py-0.5 rounded shadow-sm">
                    {item.tag}
                  </span>
                  <p className="text-xs text-text-muted leading-relaxed font-medium">{item.desc}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4 relative z-10">
                  <div className="text-blue-accent text-xs font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1.5">
                    {item.cta.replace(' ↗', '')} <ArrowUpRight size={14} />
                  </div>
                </div>
              </a>
            ))}
            {filteredPlatforms.length === 0 && <div className="col-span-full text-center py-12 text-text-muted bg-card-surface border border-border rounded-2xl font-bold">No masterclasses found.</div>}
          </motion.div>
        )}

        {activeTab === "youtube" && (
          <motion.div
            key="youtube"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredChannels.map((item, i) => (
              <a
                key={item.id}
                href={item.url} target="_blank" rel="noopener noreferrer"
                className="bg-card-surface border border-border rounded-2xl p-6 flex flex-col gap-4 group hover:border-[#FF0000]/50 hover:shadow-[0_8px_30px_rgba(255,0,0,0.08)] transition-all relative overflow-hidden"
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-14 h-14 rounded-full bg-bg-secondary border border-border flex items-center justify-center font-bold text-xl text-text-primary group-hover:border-[#FF0000]/30 shadow-sm">
                    {item.avatar}
                  </div>
                  <button 
                    onClick={(e) => toggleSave(item.id, e)}
                    className={`p-2 rounded-lg transition-colors border shadow-sm ${isSaved(item.id) ? "bg-green-gain/10 border-green-gain/20 text-green-gain" : "bg-bg-secondary border-border text-text-muted hover:text-[#FF0000] hover:border-[#FF0000]/30"}`}
                  >
                    {isSaved(item.id) ? <Check size={16} /> : <Bookmark size={16} />}
                  </button>
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="font-heading font-bold text-text-primary text-lg mb-2 group-hover:text-[#FF0000] transition-colors leading-tight">{item.name}</h3>
                  <span className="inline-block mb-3 text-[10px] font-bold text-[#FF0000] tracking-widest uppercase bg-[#FF0000]/10 border border-[#FF0000]/20 px-2 py-0.5 rounded shadow-sm">
                    {item.focus}
                  </span>
                  <p className="text-xs text-text-muted leading-relaxed font-medium">{item.desc}</p>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[#FF0000] text-xs font-bold relative z-10 group-hover:translate-x-1 transition-transform border-t border-border/50 pt-4">
                  <Play size={14} fill="currentColor" /> {item.cta.replace('▶ ', '')}
                </div>
              </a>
            ))}
            {filteredChannels.length === 0 && <div className="col-span-full text-center py-12 text-text-muted bg-card-surface border border-border rounded-2xl font-bold">No channels found.</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
