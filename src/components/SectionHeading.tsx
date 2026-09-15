import { RevealEyebrow, RevealHeading } from './Reveal'

export function SectionHeading({ number, label, title, id }: { number: string; label: string; title: string; id: string }) {
  return <div className="section-heading">
    <RevealEyebrow><span>{number}</span> {label}</RevealEyebrow>
    <RevealHeading id={id} words>{title}</RevealHeading>
  </div>
}
