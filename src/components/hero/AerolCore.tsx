import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { Group } from 'three'
import { makeMonogram, makePlateOutline } from './geometry'
import type { SceneColors } from './sceneTypes'

const extrusion = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.018, bevelSegments: 2, steps: 1, curveSegments: 1 }

export function AerolCore({ colors, compact, active }: { colors: SceneColors; compact: boolean; active: boolean }) {
  const group = useRef<Group>(null)
  const time = useRef(0)
  const monogram = useMemo(makeMonogram, [])
  const outline = useMemo(() => makePlateOutline(2.28, 2.48, 0.16), [])

  useFrame((_, delta) => {
    if (!group.current || !active) return
    time.current += Math.min(delta, 0.05)
    const amplitude = compact ? 0.45 : 1
    group.current.position.y = Math.sin(time.current * 0.42) * 0.065 * amplitude
    group.current.rotation.x = 0.12 + Math.sin(time.current * 0.27) * 0.035 * amplitude
    group.current.rotation.y = -0.35 + Math.sin(time.current * 0.22) * 0.06 * amplitude
    group.current.rotation.z = -0.12 + Math.sin(time.current * 0.18) * 0.018 * amplitude
  })

  return <group ref={group} name="AEROL core" rotation={[0.12, -0.35, -0.12]}>
    <RoundedBox args={[2.25, 2.45, 0.16]} radius={0.07} smoothness={2} bevelSegments={2} steps={1} position={[0.18, -0.16, -0.27]}>
      <meshStandardMaterial color={colors.graphite} roughness={0.55} metalness={0.4} />
    </RoundedBox>
    <RoundedBox args={[2.32, 2.52, 0.16]} radius={0.07} smoothness={2} bevelSegments={2} steps={1} position={[0.09, -0.08, -0.13]}>
      <meshStandardMaterial color={colors.surface} roughness={0.4} metalness={0.55} />
    </RoundedBox>
    <RoundedBox args={[2.4, 2.6, 0.24]} radius={0.1} smoothness={2} bevelSegments={2} steps={1}>
      <meshStandardMaterial color={colors.surface} roughness={0.4} metalness={0.4} />
    </RoundedBox>
    <lineLoop position={[0, 0, 0.126]}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[outline, 3]} /></bufferGeometry>
      <lineBasicMaterial color={colors.line} transparent opacity={0.4} depthWrite={false} />
    </lineLoop>
    <mesh position={[-0.08, 0, 0.14]}>
      <extrudeGeometry args={[monogram, extrusion]} />
      <meshStandardMaterial color={colors.white} roughness={0.28} metalness={0.2} />
    </mesh>
    <mesh position={[0.69, -0.64, 0.22]}>
      <sphereGeometry args={[0.14, 20, 12]} />
      <meshStandardMaterial color={colors.accent} emissive={colors.accent} emissiveIntensity={0.3} roughness={0.26} metalness={0.2} />
    </mesh>
  </group>
}
