import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Color, MathUtils, Vector3 } from 'three'
import type { Group, MeshStandardMaterial } from 'three'
import { orbits } from './geometry'
import type { ProjectNodeIdentity } from './projectNodes'
import type { SceneColors } from './sceneTypes'

type Segment = readonly [number, number, number, number]
const glyphs: Record<ProjectNodeIdentity['glyph'], readonly Segment[]> = {
  O: [[-.08,-.1,.08,-.1],[.08,-.1,.11,-.06],[.11,-.06,.11,.06],[.11,.06,.08,.1],[.08,.1,-.08,.1],[-.08,.1,-.11,.06],[-.11,.06,-.11,-.06],[-.11,-.06,-.08,-.1]],
  AI: [[-.14,-.1,-.075,.1],[-.075,.1,-.01,-.1],[-.115,-.025,-.035,-.025],[.09,-.1,.09,.1]],
  P: [[-.08,-.1,-.08,.1],[-.08,.1,.07,.1],[.07,.1,.07,0],[.07,0,-.08,0]],
  K: [[-.08,-.1,-.08,.1],[-.08,0,.09,.1],[-.08,0,.09,-.1]],
}

export function ProjectNode({ node, colors, active, compact, finePointer }: {
  node: ProjectNodeIdentity; colors: SceneColors; active: boolean; compact: boolean; finePointer: boolean
}) {
  const group = useRef<Group>(null)
  const face = useRef<MeshStandardMaterial>(null)
  const hovered = useRef(false)
  const phase = useRef(node.phase as number)
  const gl = useThree(state => state.gl)
  const orbit = orbits[node.orbit]
  const initial = useMemo(() => new Vector3(Math.cos(node.phase) * orbit.rx, Math.sin(node.phase) * orbit.ry, 0).applyEuler(orbit.tilt), [node.phase, orbit])
  const accent = useMemo(() => new Color(colors.accent), [colors.accent])

  useEffect(() => {
    if (!active || !finePointer) { hovered.current = false; gl.domElement.style.cursor = '' }
    return () => { gl.domElement.style.cursor = '' }
  }, [active, finePointer, gl])

  useFrame((_, delta) => {
    if (!group.current || !active) return
    const dt = Math.min(delta, 0.05)
    phase.current += dt * node.speed * (hovered.current ? 0.35 : 1) * (compact ? 0.65 : 1)
    group.current.position.set(Math.cos(phase.current) * orbit.rx, Math.sin(phase.current) * orbit.ry, 0).applyEuler(orbit.tilt)
    const scale = MathUtils.damp(group.current.scale.x, hovered.current ? 1.12 : 1, 7, dt)
    group.current.scale.setScalar(scale)
    if (face.current) {
      face.current.emissive.copy(accent)
      face.current.emissiveIntensity = MathUtils.damp(face.current.emissiveIntensity, hovered.current ? 0.28 : 0.025, 7, dt)
    }
  })

  return <group ref={group} name={node.name} position={initial}
    onPointerOver={event => {
      if (!finePointer) return
      event.stopPropagation()
      hovered.current = true
      gl.domElement.style.cursor = 'crosshair'
    }}
    onPointerOut={() => { hovered.current = false; gl.domElement.style.cursor = '' }}>
    <RoundedBox args={[0.46, 0.42, 0.12]} radius={0.045} smoothness={2} bevelSegments={1} steps={1}>
      <meshStandardMaterial ref={face} color={colors.surface} roughness={0.4} metalness={0.4} emissive={colors.accent} emissiveIntensity={0.025} />
    </RoundedBox>
    <mesh position={[0, -0.184, 0.064]}>
      <boxGeometry args={[0.28, 0.014, 0.01]} />
      <meshBasicMaterial color={colors.accent} />
    </mesh>
    {glyphs[node.glyph].map(([x1, y1, x2, y2], index) => <mesh key={index} position={[(x1 + x2) / 2, (y1 + y2) / 2, 0.072]} rotation={[0, 0, Math.atan2(y2 - y1, x2 - x1)]}>
      <boxGeometry args={[Math.hypot(x2 - x1, y2 - y1), 0.024, 0.018]} />
      <meshBasicMaterial color={colors.white} />
    </mesh>)}
  </group>
}
