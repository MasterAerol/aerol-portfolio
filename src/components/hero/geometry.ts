import { Euler, Path, Shape } from 'three'

export const orbits = [
  { rx: 2.7, ry: 1.7, tilt: new Euler(0.28, -0.25, -0.15) },
  { rx: 2.65, ry: 1.75, tilt: new Euler(-0.45, 0.2, 0.25) },
  { rx: 2.55, ry: 1.8, tilt: new Euler(0.65, 0.3, -0.4) },
]

export function makeEllipse(rx: number, ry: number) {
  const positions = new Float32Array(96 * 3)
  for (let i = 0; i < 96; i++) {
    const angle = i / 96 * Math.PI * 2
    positions[i * 3] = Math.cos(angle) * rx
    positions[i * 3 + 1] = Math.sin(angle) * ry
  }
  return positions
}

export function makeMonogram() {
  const shape = new Shape()
  shape.moveTo(-0.67, -0.72)
  shape.lineTo(-0.22, 0.72)
  shape.lineTo(0.22, 0.72)
  shape.lineTo(0.67, -0.72)
  shape.lineTo(0.31, -0.72)
  shape.lineTo(0.17, -0.27)
  shape.lineTo(-0.17, -0.27)
  shape.lineTo(-0.31, -0.72)
  shape.closePath()
  const hole = new Path()
  hole.moveTo(-0.105, -0.02)
  hole.lineTo(0, 0.36)
  hole.lineTo(0.105, -0.02)
  hole.closePath()
  shape.holes.push(hole)
  return shape
}

export function makePlateOutline(width: number, height: number, radius: number) {
  const shape = new Shape()
  const x = -width / 2
  const y = -height / 2
  shape.moveTo(x + radius, y)
  shape.lineTo(x + width - radius, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + radius)
  shape.lineTo(x + width, y + height - radius)
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  shape.lineTo(x + radius, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - radius)
  shape.lineTo(x, y + radius)
  shape.quadraticCurveTo(x, y, x + radius, y)
  return new Float32Array(shape.getPoints(6).flatMap(point => [point.x, point.y, 0]))
}
