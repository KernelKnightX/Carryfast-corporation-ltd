import React from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-sm font-semibold text-gold-500 uppercase tracking-[0.3em]">Something went wrong</p>
          <h1 className="mt-4 text-4xl font-bold text-navy-900">An unexpected error occurred.</h1>
          <p className="mt-4 max-w-xl text-base text-slate-600">
            Please refresh the page or return to the homepage. If the error persists, contact support.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            Back to home
          </Link>
        </main>
      );
    }
    return this.props.children;
  }
}
