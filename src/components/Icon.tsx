type IconName = 'arrow-up-right' | 'arrow-right' | 'arrow-down' | 'code' | 'workflow' | 'layers' | 'file' | 'mail' | 'github' | 'linkedin'

const paths: Record<IconName, string[]> = {
  'arrow-up-right': ['M7 17 17 7', 'M7 7h10v10'],
  'arrow-right': ['M4 12h16', 'm14 6 6 6-6 6'],
  'arrow-down': ['M12 4v16', 'm6 14 6 6 6-6'],
  code: ['m8 7-5 5 5 5', 'm16 7 5 5-5 5', 'm14 4-4 16'],
  workflow: ['M12 8v4', 'M5 16v-4h14v4', 'M8 3h8v5H8z', 'M2 16h6v5H2z', 'M16 16h6v5h-6z'],
  layers: ['m12 3 10 6-10 6L2 9z', 'm2 13 10 6 10-6', 'm2 17 10 6 10-6'],
  file: ['M14 2H5v20h14V7z', 'M14 2v6h5', 'M8 12h8', 'M8 16h6'],
  mail: ['M3 5h18v14H3z', 'm3 5 9 8 9-8'],
  linkedin: ['M3 9h4v12H3z', 'M3 3h4v3H3z', 'M11 21V9h4v2c1-2 6-3 6 3v7h-4v-7c0-2-2-2-2 0v7z'],
  github: ['M9 19c-4 1-4-2-6-2', 'M9 22v-4c0-1 .2-1.6-.6-2C5 15.5 3 14 3 10a6 6 0 0 1 1.5-4C4 4.5 4 3 5 2c2 0 3 1 4 1a14 14 0 0 1 6 0c1 0 2-1 4-1 1 1 1 2.5.5 4a6 6 0 0 1 1.5 4c0 4-2 5.5-5.4 6-.8.4-.6 1-.6 2v4'],
}

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <svg className={`icon ${className}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {paths[name].map((d, i) => <path key={i} d={d} />)}
  </svg>
}
