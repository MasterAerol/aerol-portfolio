import { useState } from 'react'
import type { ProjectVisual, StoryNode } from '../../types/project'

function Connector({ join = false, split = false }: { join?: boolean; split?: boolean }) {
  return <svg className="story-connector" viewBox="0 0 120 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
    <path d={split ? 'M60 1V7H30V18M26 14L30 18L34 14M60 7H90V18M86 14L90 18L94 14' : join ? 'M30 1V7H60M90 1V7H60M60 7V18M56 14L60 18L64 14' : 'M60 1V18M56 14L60 18L64 14'} />
  </svg>
}

function NodeButton({ node, selected, onSelect, panel, number, children }: {
  node: StoryNode; selected: boolean; onSelect: (id: string) => void; panel: string; number?: string; children?: React.ReactNode
}) {
  return <button type="button" className="diagram-node" aria-pressed={selected} aria-controls={panel} onClick={() => onSelect(node.id)}>
    {number && <span className="diagram-number" aria-hidden="true">{number}</span>}
    <span className="diagram-node-label">{node.label}</span>
    {children}
  </button>
}

function Insight({ node, id }: { node: StoryNode; id: string }) {
  return <div className="diagram-insight" id={id} aria-live="polite" aria-atomic="true">
    <p className="insight-label">{node.label}</p>
    <p>{node.description}</p>
    {node.features && <ul>{node.features.map(feature => <li key={feature}>{feature}</li>)}</ul>}
  </div>
}

export function WorkflowVisual({ visual, id }: { visual: Extract<ProjectVisual, { kind: 'workflow' }>; id: string }) {
  const [path, setPath] = useState<'review' | 'recovery'>('review')
  const [selectedId, setSelectedId] = useState(visual.review[0][0].id)
  const rows = path === 'review' ? visual.review : visual.recovery.map(node => [node])
  const selected = rows.flat().find(node => node.id === selectedId) ?? rows[0][0]
  const panel = `${id}-insight`
  return <>
    <div className="diagram-switch" role="group" aria-label="OpsCheck path">
      {(['review', 'recovery'] as const).map(value => <button type="button" key={value} aria-pressed={path === value} aria-controls={`${id}-path`} onClick={() => {
        setPath(value)
        setSelectedId(value === 'review' ? visual.review[0][0].id : visual.recovery[0].id)
      }}>{value === 'review' ? 'Review workflow' : 'Recovery path'}</button>)}
    </div>
    <ol id={`${id}-path`} className={`workflow-path path-${path}`} aria-label={path === 'review' ? 'Operational review workflow' : 'Worker recovery workflow'}>
      {rows.map((row, index) => <li key={row[0].id}>
        {index > 0 && <Connector join={rows[index - 1].length > 1} split={row.length > 1} />}
        {row.length > 1 && <p className="diagram-branch-label">{row.some(node => node.id === 'revise') ? 'Human decision: revise or complete' : 'Parallel workers'}</p>}
        <div className={`workflow-row ${row.length > 1 ? 'workflow-branch' : ''}`}>
          {row.map(node => <NodeButton key={node.id} node={node} selected={selected.id === node.id} onSelect={setSelectedId} panel={panel} />)}
        </div>
      </li>)}
    </ol>
    <p className="diagram-footnote">{path === 'review' ? 'Revise returns to the workflow. Complete follows human approval.' : 'Retained work can return through replay.'}</p>
    <Insight node={selected} id={panel} />
  </>
}

export function LayersVisual({ visual, id }: { visual: Extract<ProjectVisual, { kind: 'layers' }>; id: string }) {
  const [selectedId, setSelectedId] = useState(visual.layers[0].id)
  const selected = visual.layers.find(node => node.id === selectedId)!
  const panel = `${id}-insight`
  return <>
    <div className="system-layers" role="group" aria-label="Operations system layers">
      {visual.layers.map((node, index) => <div className="system-layer" key={node.id}>
        {index > 0 && <span className="layer-join" aria-hidden="true">+</span>}
        <NodeButton node={node} selected={selected.id === node.id} onSelect={setSelectedId} panel={panel} number={String(index + 1).padStart(2, '0')}>
          <span className="layer-features">{node.features?.map(feature => <span key={feature}>{feature}</span>)}</span>
        </NodeButton>
      </div>)}
    </div>
    <Insight node={selected} id={panel} />
  </>
}

export function LearningVisual({ visual, id }: { visual: Extract<ProjectVisual, { kind: 'learning' }>; id: string }) {
  const [selectedId, setSelectedId] = useState(visual.stages[0].id)
  const selected = visual.stages.find(node => node.id === selectedId)!
  const panel = `${id}-insight`
  return <>
    <div className="learning-loop" role="group" aria-label="PasaWise study stages">
      <svg className="learning-connectors" viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path d="M170 72H228M222 66L228 72L222 78M304 128V170M298 164L304 170L310 164M228 226H170M176 220L170 226L176 232M94 170V128M88 134L94 128L100 134" />
      </svg>
      {visual.stages.map((node, index) => <div className={`learning-stage stage-${node.id}`} key={node.id}>
        <NodeButton node={node} selected={selected.id === node.id} onSelect={setSelectedId} panel={panel} number={String(index + 1).padStart(2, '0')}>
          <span className="stage-preview">{node.features?.[0]}</span>
        </NodeButton>
      </div>)}
    </div>
    <p className="loop-return"><span aria-hidden="true">↻</span> Recover → next study → continue learning</p>
    <Insight node={selected} id={panel} />
  </>
}

export function OrganizerVisual({ visual, id }: { visual: Extract<ProjectVisual, { kind: 'organizer' }>; id: string }) {
  const [selectedId, setSelectedId] = useState(visual.concepts[0].id)
  const selected = visual.concepts.find(node => node.id === selectedId)!
  const panel = `${id}-insight`
  return <>
    <div className="organizer-map" role="group" aria-label="Kivo product concepts">
      <div className="organizer-core" aria-hidden="true"><span>KIVO<span className="organizer-dot">.</span></span><small>LIFE ORGANIZER</small></div>
      <div className="organizer-branches">
        {visual.concepts.map(node => <NodeButton key={node.id} node={node} selected={selected.id === node.id} onSelect={setSelectedId} panel={panel} />)}
      </div>
    </div>
    <div className="organizer-categories"><p>Information categories</p><ul>{visual.categories.map(category => <li key={category}>{category}</li>)}</ul></div>
    <Insight node={selected} id={panel} />
  </>
}

export function ProjectDiagram({ visual, id }: { visual: ProjectVisual; id: string }) {
  switch (visual.kind) {
    case 'workflow': return <WorkflowVisual visual={visual} id={id} />
    case 'layers': return <LayersVisual visual={visual} id={id} />
    case 'learning': return <LearningVisual visual={visual} id={id} />
    case 'organizer': return <OrganizerVisual visual={visual} id={id} />
  }
}
