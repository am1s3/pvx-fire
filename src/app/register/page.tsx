'use client'

export default function Register() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: '20px' }}>
      <div style={{ background: '#171717', border: '1px solid #7f1d1d', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ color: '#ef4444', textAlign: 'center', marginBottom: '30px', fontSize: '28px' }}>
          Регистрация
        </h1>
        
        <form>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px', fontSize: '14px' }}>
              Minecraft Ник
            </label>
            <input 
              type="text" 
              style={{ 
                width: '100%', 
                background: '#0a0a0a', 
                border: '1px solid #450a0a', 
                borderRadius: '8px', 
                padding: '12px', 
                color: 'white',
                boxSizing: 'border-box'
              }}
              placeholder="Steve"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#9ca3af', marginBottom: '8px', fontSize: '14px' }}>
              Пароль
            </label>
            <input 
              type="password" 
              style={{ 
                width: '100%', 
                background: '#0a0a0a', 
                border: '1px solid #450a0a', 
                borderRadius: '8px', 
                padding: '12px', 
                color: 'white',
                boxSizing: 'border-box'
              }}
              placeholder="Минимум 6 символов"
            />
          </div>

          <button 
            type="submit"
            style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, #dc2626, #f97316)', 
              color: 'white', 
              fontWeight: 'bold', 
              padding: '14px', 
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Создать аккаунт
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '20px', fontSize: '14px' }}>
          Уже есть аккаунт? <a href="/login" style={{ color: '#f87171' }}>Войти</a>
        </p>
      </div>
    </div>
  )
}
