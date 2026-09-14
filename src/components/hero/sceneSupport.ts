let webGLSupport: boolean | undefined

export function supportsWebGL(): boolean {
  if (webGLSupport !== undefined) return webGLSupport
  if (typeof window === 'undefined' || !window.WebGL2RenderingContext) return false
  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2', { alpha: true, powerPreference: 'low-power' })
    webGLSupport = Boolean(context)
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    return webGLSupport
  } catch {
    webGLSupport = false
    return false
  }
}
