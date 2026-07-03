'use client'
import { useEffect, useState } from 'react'

export default function LiderPage() {
  const [usuario, setUsuario] = useState<any>(null)

  useEffect(() => {
    const u = localStorage.getItem('set_usuario')
    if (!u) { window.location.href = '/'; return }
    setUsuario(JSON.parse(u))
  }, [])

  function logout() {
    localStorage.removeItem('set_usuario')
    window.location.href = '/'
  }

  if (!usuario) return null

  const APPS_URL = 'https://script.google.com/macros/s/AKfycbzZPRr9FRLqJPbEBQioRSU8GkROXIMKk-I96yBN7kWDr2VQ6fXxxHofuTbbcXRsBPlYVQ/exec'

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #5b1f9e, #7B2FBE)',
        padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '60px', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: '800', color: '#fff', fontSize: '16px'
          }}>S</div>
          <div>
            <div style={{ color: '#fff', fontWeight: '800', fontSize: '15px', lineHeight: 1 }}>CONTROLE DE EFETIVO</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>SET MANUTENÇÕES</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(usuario.role === 'gestor' || usuario.role === 'admin') && (
            <button
              onClick={() => window.location.href = '/gestor'}
              style={{
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff', padding: '6px 14px', borderRadius: '8px',
                fontSize: '12px', cursor: 'pointer', fontWeight: '600'
              }}
            >
              Área do Gestor
            </button>
          )}
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
            Olá, {usuario.nome.split(' ')[0]}
          </div>
          <button
            onClick={logout}
            style={{
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', padding: '6px 12px', borderRadius: '8px',
              fontSize: '12px', cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </div>

      {/* Dashboard embed */}
      <iframe
        src={`/dashboard`}
        style={{ width: '100%', height: 'calc(100vh - 60px)', border: 'none' }}
      />
    </div>
  )
}
