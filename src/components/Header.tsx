import { useEffect, useRef, useState } from 'react'
import { navigation } from '../data/profile'
import { Icon } from './Icon'

export function Header() {
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && open) {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    function onPointer(event: PointerEvent) {
      if (open && !headerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 768px)')
    function onResize() { if (desktop.matches) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
      desktop.removeEventListener('change', onResize)
    }
  }, [open])

  return <header className="site-header" ref={headerRef} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false) }}>
    <div className="container header-inner">
      <a href="#home" className="brand" aria-label="Aerol — home">AEROL<span>.</span></a>
      <button ref={toggleRef} className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} onClick={() => setOpen(!open)}>
        <span>{open ? 'Close' : 'Menu'}</span><span className={`menu-lines ${open ? 'is-open' : ''}`} aria-hidden="true" />
      </button>
      <nav id="primary-navigation" className={`primary-nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
        {navigation.map(item => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}{item.label === 'Contact' && <Icon name="arrow-up-right" />}</a>)}
      </nav>
    </div>
  </header>
}
