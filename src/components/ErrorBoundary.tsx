import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Uncaught error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-card">
          Something went wrong. Reload the page to reopen your saved drafts.
        </div>
      );
    }
    return this.props.children;
  }
}
