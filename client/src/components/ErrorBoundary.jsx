import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9F0] px-4">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center">
            <span className="text-4xl">⚠️</span>
            <h1 className="text-2xl font-bold text-[#1B2A1E] mt-4 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6 text-sm">
              We encountered an unexpected error. Don't worry, your progress has been saved locally.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-medium rounded-xl transition duration-200 shadow-md cursor-pointer"
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
