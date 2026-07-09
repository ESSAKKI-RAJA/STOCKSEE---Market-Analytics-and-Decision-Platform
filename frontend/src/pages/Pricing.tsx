import React from "react";
import { Helmet } from "react-helmet";
import { Check } from "lucide-react";

const Pricing = () => {
  return (
    <div className="w-full min-h-screen py-16 px-6 animate-fade-in-up flex flex-col items-center justify-center">
      <Helmet>
        <title>Upgrade to Pro | STOCKSEE</title>
      </Helmet>
      <div className="mb-12 text-center max-w-2xl">
        <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Unlock Institutional Intelligence</h1>
        <p className="text-lg text-muted-foreground">Upgrade to Pro for advanced quant engines, real-time alerts, and unlimited AI reports.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Free Plan */}
        <div className="t-panel p-8 border-border flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">Basic</h2>
          <p className="text-muted-foreground mb-6">For casual investors</p>
          <div className="text-4xl font-bold mb-6">$0<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3"><Check className="text-green-500 w-5 h-5" /> 3 AI reports/day</li>
            <li className="flex items-center gap-3"><Check className="text-green-500 w-5 h-5" /> 1 Watchlist</li>
            <li className="flex items-center gap-3"><Check className="text-green-500 w-5 h-5" /> Basic charts</li>
          </ul>
          <button className="t-btn w-full">Current Plan</button>
        </div>

        {/* Pro Plan */}
        <div className="t-panel p-8 border-blue-accent/50 relative flex flex-col shadow-[0_0_40px_rgba(37,99,255,0.15)]">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
          <h2 className="text-2xl font-semibold mb-2">Pro</h2>
          <p className="text-muted-foreground mb-6">For serious market participants</p>
          <div className="text-4xl font-bold mb-6">$19<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3"><Check className="text-blue-accent w-5 h-5" /> Unlimited AI reports</li>
            <li className="flex items-center gap-3"><Check className="text-blue-accent w-5 h-5" /> Advanced Quant Engine</li>
            <li className="flex items-center gap-3"><Check className="text-blue-accent w-5 h-5" /> Unlimited watchlists</li>
            <li className="flex items-center gap-3"><Check className="text-blue-accent w-5 h-5" /> Real-time alerts</li>
            <li className="flex items-center gap-3"><Check className="text-blue-accent w-5 h-5" /> Portfolio AI</li>
            <li className="flex items-center gap-3"><Check className="text-blue-accent w-5 h-5" /> Premium screeners</li>
          </ul>
          <button className="t-btn t-btn-primary w-full">Upgrade Now</button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
