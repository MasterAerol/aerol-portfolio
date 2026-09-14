import { useMemo } from 'react'
import { makeEllipse, orbits } from './geometry'
import { projectNodes } from './projectNodes'
import { ProjectNode } from './ProjectNode'
import type { SceneColors } from './sceneTypes'

export function OrbitSystem({ colors, active, compact, finePointer }: { colors: SceneColors; active: boolean; compact: boolean; finePointer: boolean }) {
  const paths = useMemo(() => orbits.map(orbit => makeEllipse(orbit.rx, orbit.ry)), [])
  return <group name="Project orbit system">
    {orbits.map((orbit, index) => <group key={index} rotation={orbit.tilt}>
      <lineLoop>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[paths[index], 3]} /></bufferGeometry>
        <lineBasicMaterial color={index === 0 ? colors.accent : colors.line} transparent opacity={index === 0 ? 0.23 : 0.17} depthWrite={false} />
      </lineLoop>
    </group>)}
    {projectNodes.map(node => <ProjectNode key={node.id} node={node} colors={colors} active={active} compact={compact} finePointer={finePointer} />)}
  </group>
}
