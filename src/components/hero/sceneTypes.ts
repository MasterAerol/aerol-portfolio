export interface SceneColors {
  graphite: string
  surface: string
  white: string
  accent: string
  line: string
}
export interface PointerTarget { x: number; y: number; inside: boolean }
export interface SceneProps {
  active: boolean
  compact: boolean
  finePointer: boolean
  colors: SceneColors
  pointer: { current: PointerTarget }
  onReady: () => void
  onFailure: () => void
}
