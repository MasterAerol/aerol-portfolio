/**
 * Optional, decorative enhancement boundary for a future lazy-loaded HeroScene.
 * Keep the CSS fallback, aria-hidden, and pointer-events:none. Future 3D must
 * respect reduced motion and device capability and never contain required copy.
 */
export function HeroVisualBoundary() {
  return <div className="hero-visual" aria-hidden="true">
    <div className="visual-grid" />
    <div className="orbital orbital-outer" />
    <div className="orbital orbital-inner" />
    <div className="core-frame"><span>A<span className="core-dot">.</span></span></div>
    <span className="visual-cross cross-one">+</span><span className="visual-cross cross-two">+</span>
    <span className="visual-caption">IDEAS → SYSTEMS → PRODUCTS</span>
    <span className="visual-axis">A / 01</span>
  </div>
}
