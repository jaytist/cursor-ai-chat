import React, { Component, ErrorInfo, ReactNode } from "react";
import { ErrorProvider } from "../contexts/ErrorContext";
import { CustomErrorFallback } from "./CustomErrorFallabck";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error);
    console.error("Error info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorProvider>
          {this.props.fallback || (
            <CustomErrorFallback error={this.state.error} />
          )}
        </ErrorProvider>
      );
    }

    return <ErrorProvider>{this.props.children}</ErrorProvider>;
  }
}

export default ErrorBoundary;
