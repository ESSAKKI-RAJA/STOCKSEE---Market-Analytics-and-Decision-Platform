import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-accent/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>
      
      <div className="z-10 w-full max-w-md animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-accent/20 rounded-xl flex items-center justify-center mb-4 border border-blue-accent/30 shadow-[0_0_15px_rgba(37,99,255,0.2)]">
            <span className="text-blue-accent font-bold text-xl">S</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-text-primary tracking-tight">STOCKSEE</h1>
          <p className="text-text-muted mt-2">Institutional-grade market intelligence</p>
        </div>
        
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/signup"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-surface shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-border-primary/50 rounded-2xl w-full",
              headerTitle: "text-text-primary font-heading font-bold",
              headerSubtitle: "text-text-muted",
              socialButtonsBlockButton: "bg-surface-hover border-border-primary/50 text-text-primary hover:bg-surface-active transition-colors",
              socialButtonsBlockButtonText: "text-text-primary font-medium",
              dividerLine: "bg-border-primary",
              dividerText: "text-text-muted bg-surface",
              formFieldLabel: "text-text-secondary font-medium",
              formFieldInput: "bg-bg-base border-border-primary/50 text-text-primary focus:border-blue-accent focus:ring-1 focus:ring-blue-accent transition-all rounded-xl",
              formButtonPrimary: "bg-blue-accent hover:bg-blue-accent/90 text-white font-bold shadow-[0_4px_14px_rgba(37,99,255,0.39)] transition-all rounded-xl py-2.5",
              footerActionText: "text-text-muted",
              footerActionLink: "text-blue-accent hover:text-blue-accent/80 font-medium",
              identityPreviewText: "text-text-primary",
              identityPreviewEditButton: "text-blue-accent hover:text-blue-accent/80",
            },
            variables: {
              colorBackground: "#0a0b0d", // Match bg-surface
              colorText: "#e2e8f0", // Match text-primary
              colorPrimary: "#2563eb", // Match blue-accent
              colorTextSecondary: "#94a3b8", // Match text-muted
              fontFamily: "Inter, sans-serif",
            }
          }}
        />
      </div>
    </div>
  );
}
