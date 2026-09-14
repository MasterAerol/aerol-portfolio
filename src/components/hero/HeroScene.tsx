import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, PerspectiveCamera } from 'three'
import type { Group } from 'three'
import { AerolCore } from './AerolCore'
import { OrbitSystem } from './OrbitSystem'
import { SceneLighting } from './SceneLighting'
import { SceneCanvas } from './SceneCanvas'
import type { SceneProps } from './sceneTypes'

function SceneContents(props: SceneProps) {
  const group = useRef<Group>(null)
  const announced = useRef(false)
  const failed = useRef(false)
  const hoverElapsed = useRef(0)
  const gl = useThree(state => state.gl)
  const camera = useThree(state => state.camera)
  const size = useThree(state => state.size)
  const invalidate = useThree(state => state.invalidate)

  useLayoutEffect(() => {
    if (camera instanceof PerspectiveCamera) {
      const aspect = size.width / Math.max(size.height, 1)
      camera.position.z = Math.max(8.6, 3.05 / Math.tan(Math.PI / 9) / aspect + 1.15)
      camera.updateProjectionMatrix()
      invalidate()
    }
  }, [camera, size.width, size.height, invalidate])

  // Positive priority owns exactly one draw, after core/node frame updates.
  useFrame(state => {
    if (failed.current) return
    try {
      gl.render(state.scene, state.camera)
      if (!announced.current) { announced.current = true; props.onReady() }
    } catch {
      failed.current = true
      state.setFrameloop('never')
      props.onFailure()
    }
  }, 1)

  useFrame((state, delta) => {
    if (!group.current || !props.active) return
    const dt = Math.min(delta, 0.05)
    group.current.rotation.x = MathUtils.damp(group.current.rotation.x, props.finePointer ? -props.pointer.current.y * 0.075 : 0, 3, dt)
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, props.finePointer ? props.pointer.current.x * 0.12 : 0, 3, dt)
    // Nodes move beneath a stationary cursor; modest raycast refresh releases hover.
    hoverElapsed.current += dt
    if (props.finePointer && props.pointer.current.inside && hoverElapsed.current >= 0.1) {
      hoverElapsed.current = 0
      state.events.update?.()
    }
  })

  return <>
    <SceneLighting colors={props.colors} />
    <group ref={group}>
      <AerolCore colors={props.colors} active={props.active} compact={props.compact} />
      <OrbitSystem colors={props.colors} active={props.active} compact={props.compact} finePointer={props.finePointer} />
    </group>
  </>
}

export default function HeroScene(props: SceneProps) {
  return <SceneCanvas {...props}><SceneContents {...props} /></SceneCanvas>
}
