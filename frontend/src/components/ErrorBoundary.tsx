import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("[ErrorBoundary] Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0b0f19",
            color: "#e2e8f0",
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            padding: 32,
          }}
        >
          <div
            style={{
              maxWidth: 560,
              width: "100%",
              background: "#141925",
              border: "1px solid #1e293b",
              borderRadius: 16,
              padding: 32,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            }}
          >
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 8,
                color: "#f87171",
              }}
            >
              STOCKSEE UI Error
            </h1>
            <p
              style={{
                fontSize: 14,
                color: "#94a3b8",
                marginBottom: 20,
                lineHeight: 1.6,
              }}
            >
              Something went wrong while rendering. This is usually caused by a
              missing backend connection, a browser extension conflict, or a
              code error.
            </p>

            <div
              style={{
                background: "#0f1219",
                border: "1px solid #1e293b",
                borderRadius: 8,
                padding: 16,
                marginBottom: 20,
                fontFamily: "monospace",
                fontSize: 12,
                color: "#f87171",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: 200,
                overflow: "auto",
              }}
            >
              {this.state.error?.toString()}
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: "10px 20px",
                  background: "#2563ff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                }}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  color: "#94a3b8",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                Try Again
              </button>
            </div>

            <p
              style={{
                fontSize: 11,
                color: "#475569",
                marginTop: 20,
              }}
            >
              Check the browser console (F12) and verify the backend is running
              at http://127.0.0.1:8000/health
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
