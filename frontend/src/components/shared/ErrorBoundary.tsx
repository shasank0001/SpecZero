/**
 * Error Boundary Component
 * 
 * Catches errors gracefully with a polished fallback UI.
 * Aesthetic: Calm, helpful, non-alarming
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="max-w-md w-full border-dashed">
            <CardContent className="py-8">
              <div className="flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20">
                  <AlertTriangle className="h-7 w-7" />
                </div>
                
                {/* Title */}
                <h3 className="font-display text-lg font-semibold mb-2">
                  Something went wrong
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm mb-6">
                  We encountered an unexpected error. This has been logged and we're looking into it.
                </p>
                
                {/* Error details (collapsed by default in production) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="w-full mb-6 p-3 rounded-lg bg-muted/50 border border-border text-left">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-2">
                      <Bug className="w-3.5 h-3.5" />
                      Error Details
                    </div>
                    <code className="text-xs text-red-500 font-mono block overflow-auto max-h-32">
                      {this.state.error.message}
                    </code>
                    {this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          Stack trace
                        </summary>
                        <pre className="text-[10px] text-muted-foreground font-mono mt-2 overflow-auto max-h-40">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload Page
                  </Button>
                  <Button
                    size="sm"
                    onClick={this.handleReset}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Simple functional wrapper for convenience
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
