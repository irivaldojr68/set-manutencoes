'use client'
import { useState } from 'react'
import { login } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErro('')
    
    const usuario = await login(email, senha)
    
    if (!usuario) {
      setErro('E-mail ou senha incorretos')
      setLoading(false)
      return
    }

    // Salvar sessão
    localStorage.setItem('set_usuario', JSON.stringify(usuario))
    
    // Redirecionar conforme perfil
    if (usuario.role === 'gestor' || usuario.role === 'admin') {
      window.location.href = '/gestor'
    } else {
      window.location.href = '/lider'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #5b1f9e 0%, #7B2FBE 50%, #9333ea 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, #5b1f9e, #7B2FBE)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px', fontWeight: '800', color: '#fff'
          }}>S</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1e293b' }}>SET Manutenções</h1>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>Controle de Efetivo</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #e2e8f0', borderRadius: '10px',
                fontSize: '14px', outline: 'none',
                transition: 'border .2s'
              }}
              onFocus={e => e.target.style.borderColor = '#7B2FBE'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #e2e8f0', borderRadius: '10px',
                fontSize: '14px', outline: 'none'
              }}
              onFocus={e => e.target.style.borderColor = '#7B2FBE'}
              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {erro && (
            <div style={{
              background: '#fee2e2', border: '1px solid #fecaca',
              borderRadius: '8px', padding: '10px 14px',
              fontSize: '13px', color: '#dc2626', marginBottom: '16px'
            }}>
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #5b1f9e, #7B2FBE)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity .2s'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '24px' }}>
          SET Manutenções © 2026
        </p>
      </div>
    </div>
  )
}
