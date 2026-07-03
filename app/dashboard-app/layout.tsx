'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<any>(null)
  const [menuAberto, setMenuAberto] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const u = localStorage.getItem('set_usuario')
    if (!u) { router.push('/'); return }
    setUsuario(JSON.parse(u))
  }, [])

  function logout() {
    localStorage.removeItem('set_usuario')
    router.push('/')
  }

  const navItems = [
    { href: '/dashboard-app', icon: '⊞', label: 'Início' },
    { href: '/dashboard-app/horas-extras', icon: '⏱', label: 'Horas Extras' },
    { href: '/dashboard-app/ponto-adiantado', icon: '🕐', label: 'Ponto Adiantado' },
    { href: '/dashboard-app/efetivo', icon: '👥', label: 'Efetivo' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard-app') return pathname === '/dashboard-app'
    return pathname.startsWith(href)
  }

  if (!usuario) return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'Inter, sans-serif' }}>

      {/* Overlay mobile */}
      {menuAberto && (
        <div
          onClick={() => setMenuAberto(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, display: 'none' }}
          className="mobile-overlay"
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: '240px',
        background: '#1e1b4b',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 50,
        transition: 'transform 0.3s',
      }} className={`sidebar ${menuAberto ? 'sidebar-open' : ''}`}>

        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #7B2FBE, #9333ea)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '800', color: '#fff', fontSize: '18px', flexShrink: 0
            }}>S</div>
            <div>
              <div style={{ color: '#fff', fontWeight: '700', fontSize: '14px', lineHeight: 1.2 }}>SET Manutenções</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '2px' }}>Controle de Efetivo</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Menu</div>
          {navItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuAberto(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 12px', borderRadius: '10px',
                marginBottom: '4px', cursor: 'pointer',
                textDecoration: 'none',
                background: isActive(item.href) ? 'rgba(123,47,190,0.4)' : 'transparent',
                color: isActive(item.href) ? '#fff' : 'rgba(255,255,255,0.6)',
                borderLeft: isActive(item.href) ? '3px solid #9333ea' : '3px solid transparent',
                transition: 'all 0.15s',
                fontSize: '14px', fontWeight: isActive(item.href) ? '600' : '400'
              }}
            >
              <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </a>
          ))}

          {/* Gestor - separado */}
          {(usuario.role === 'gestor' || usuario.role === 'admin') && (
            <>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '1px', textTransform: 'uppercase', padding: '0 8px', marginBottom: '8px' }}>Restrito</div>
              <a
                href="/gestor"
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '11px 12px', borderRadius: '10px',
                  cursor: 'pointer', textDecoration: 'none',
                  background: pathname.startsWith('/gestor') ? 'rgba(220,38,38,0.3)' : 'transparent',
                  color: 'rgba(255,255,255,0.6)',
                  borderLeft: '3px solid transparent',
                  fontSize: '14px'
                }}
              >
                <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>💼</span>
                Área do Gestor
              </a>
            </>
          )}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7B2FBE, #9333ea)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '700', fontSize: '14px', flexShrink: 0
            }}>
              {usuario.nome?.[0] || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {usuario.nome?.split(' ')[0]}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>{usuario.role}</div>
            </div>
            <button onClick={logout} style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontSize: '16px', padding: '4px'
            }} title="Sair">⏻</button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: '240px', display: 'flex', flexDirection: 'column' }} className="main-content">

        {/* Topbar */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #e2e8f0',
          padding: '0 24px', height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 30,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
        }}>
          {/* Hamburger mobile */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="hamburger"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '22px', color: '#64748b', display: 'none', padding: '4px'
            }}
          >☰</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: '#f1f5f9', borderRadius: '8px',
              padding: '6px 12px', fontSize: '12px', color: '#64748b'
            }}>
              ALBRÁS · CC 0048
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar-open { transform: translateX(0) !important; }
          .mobile-overlay { display: block !important; }
          .main-content { margin-left: 0 !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </div>
  )
}
