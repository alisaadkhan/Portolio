import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
          <div className="max-w-2xl bg-red-950/20 border border-red-800 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-400 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-300 mb-4">
              The application encountered an error:
            </p>
            <pre className="bg-black/50 p-4 rounded text-red-300 text-sm overflow-auto max-h-96">
              {this.state.error?.toString()}
              {"\n\n"}
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
