export function SceneFallback() {
  return <div className="scene-fallback" data-testid="scene-fallback">
    <div className="visual-grid" />
    <div className="orbital orbital-outer" />
    <div className="orbital orbital-inner" />
    <div className="core-frame"><span>A<span className="core-dot">.</span></span></div>
    <span className="visual-cross cross-one">+</span>
    <span className="visual-cross cross-two">+</span>
  </div>
}
