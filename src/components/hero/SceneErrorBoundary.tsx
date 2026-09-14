import { Component } from 'react'
import type { ReactNode } from 'react'

interface Props { children: ReactNode; onFailure: () => void }
interface State { failed: boolean }

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? null : this.props.children }
}
