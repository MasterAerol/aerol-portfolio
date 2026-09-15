import type { SceneColors } from './sceneTypes'

export function SceneLighting({ colors }: { colors: SceneColors }) {
  return <>
    <ambientLight intensity={0.75} />
    <directionalLight position={[3, 4, 6]} intensity={4} color={colors.white} />
    <directionalLight position={[-4, -1, 3]} intensity={1.5} color={colors.line} />
    <pointLight position={[3, -2, 2]} intensity={5} distance={10} decay={2} color={colors.accent} />
  </>
}
