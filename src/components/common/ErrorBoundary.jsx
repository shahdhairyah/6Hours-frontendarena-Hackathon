import { Component } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

/**
 * Production ErrorBoundary component to gracefully handle React render errors.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07080b] flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#f43f5e]/15 border border-[#f43f5e]/30 flex items-center justify-center text-[#fb7185] shadow-[0_0_30px_rgba(244,63,94,0.2)]">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md">
            <h1 className="font-serif-story text-3xl text-[#fbf9f5]">
              Something unexpected occurred
            </h1>
            <p className="text-xs font-mono-receipt text-[#8e95a7] leading-relaxed">
              The Ledger engine encountered an error while rendering. Your data is safe.
            </p>
            {this.state.error?.message && (
              <pre className="p-3 rounded-xl bg-[#0e1017] border border-white/[0.08] text-[11px] font-mono-receipt text-[#fb7185] overflow-x-auto text-left">
                {this.state.error.message}
              </pre>
            )}
          </div>

          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f59e0b] text-[#07080b] font-mono-receipt font-bold text-xs hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reload Application</span>
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
