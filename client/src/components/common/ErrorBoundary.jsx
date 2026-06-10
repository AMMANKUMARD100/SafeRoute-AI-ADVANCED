import { Component } from 'react';
import GlowButton from './GlowButton';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-4">
          <div className="backdrop-blur-lg bg-white/5 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <GlowButton
              color="pink"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
            >
              Go Home
            </GlowButton>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;