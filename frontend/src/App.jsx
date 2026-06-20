import React from 'react'

const App = () => {
  return (
    <div style={{ minHeight: '100vh', padding: 0, fontFamily: 'sans-serif',  userSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem 2rem', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: 24 }}>👆</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 0.5rem' }}>Gesture Navigator</h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: 0, maxWidth: 340, lineHeight: 1.6 }}>
          Navigate anywhere by drawing shapes on screen — no buttons needed.
        </p>
      </div>

      <div style={{ margin: '0 auto 2rem', maxWidth: 480, padding: '0 1.5rem' }}>
        <div style={{ background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.25rem 1.5rem' }}>
          <p style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', margin: '0 0 1rem' }}>How to activate</p>

          {[
            { n: 1, title: 'Triple tap anywhere', desc: 'Tap the screen 3 times quickly within 600ms to enter gesture mode.' },
            { n: 2, title: 'Draw your gesture', desc: 'A dashed purple border appears — draw any shape to navigate.' },
            { n: 3, title: "You're navigated", desc: 'Lift your finger — after a short pause the page changes automatically.' },
          ].map(({ n, title, desc }) => (
            <div key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: n < 3 ? '1rem' : 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#fff', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{n}</span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, margin: '0 0 2px' }}>{title}</p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <p style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', margin: '0 0 0.75rem' }}>Available gestures</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { symbol: '○', name: 'Circle',   dest: 'Page 1' },
            { symbol: '△', name: 'Triangle', dest: 'Page 2' },
            { symbol: '✓', name: 'Check',    dest: 'Page 3' },
            { symbol: '∧', name: 'Caret',    dest: 'Page 4' },
            { symbol: '→', name: 'Arrow',    dest: 'Draw'   },
            { symbol: 'ρ', name: 'Pigtail',  dest: 'Page 5' },
          ].map(({ symbol, name, dest }) => (
            <div key={name} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>{symbol}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>{name}</p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>→ {dest}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 1.5rem 3rem' }}>
        <div style={{ background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, color: '#9ca3af' }}>⌨</span>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
            Press <kbd style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 4, padding: '1px 6px', fontSize: 12, fontFamily: 'monospace' }}>Esc</kbd> at any time to cancel a gesture.
          </p>
        </div>
      </div>

    </div>
  )
}

export default App