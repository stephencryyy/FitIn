import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

interface Props {
  children: ReactNode;
  // Optional reporter (Sentry, Crashlytics) — wired up when configured.
  onError?: (error: Error, info: ErrorInfo) => void;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Top-level Error Boundary. Catches render-time exceptions in the subtree
 * and shows a recoverable fallback instead of a white screen.
 *
 * Place at each route group entry (`app/_layout.tsx`, `(tabs)/_layout.tsx`,
 * `assistant/_layout.tsx`) so a crash inside one group doesn't kill the rest
 * of the app.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
     
    console.error('[ErrorBoundary]', error, info.componentStack);
    this.props.onError?.(error, info);
  }

  reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(this.state.error, this.reset);
    }

    return (
      <View className="flex-1 bg-white items-center justify-center px-6">
        <Text className="text-6xl mb-4">⚠️</Text>
        <Text className="text-xl font-bold text-dark-900 text-center mb-2">
          Something went wrong
        </Text>
        <Text className="text-base text-dark-400 text-center mb-6">
          The app hit an unexpected error. You can try again — your data is safe.
        </Text>
        <ScrollView
          style={{ maxHeight: 160 }}
          className="bg-dark-50 rounded-lg p-3 mb-6 w-full"
        >
          <Text className="text-xs text-dark-600 font-mono">
            {this.state.error.message}
          </Text>
        </ScrollView>
        <Pressable
          onPress={this.reset}
          className="bg-primary-500 rounded-xl px-6 py-3"
          accessibilityRole="button"
          accessibilityLabel="Try again"
        >
          <Text className="text-white font-bold">Try again</Text>
        </Pressable>
      </View>
    );
  }
}
