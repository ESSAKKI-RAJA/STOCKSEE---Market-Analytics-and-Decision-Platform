import React from "react";
import { Helmet } from "react-helmet";

const Settings = () => {
  return (
    <div className="w-full h-full p-6 animate-fade-in-up">
      <Helmet>
        <title>Settings | STOCKSEE</title>
      </Helmet>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences.</p>
      </div>
      <div className="t-panel p-6 border-border/50 text-center text-muted-foreground min-h-[400px] flex items-center justify-center">
        Settings Coming Soon
      </div>
    </div>
  );
};

export default Settings;
