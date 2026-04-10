import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GraduationCap, Eye, EyeOff, Lock, User } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(form.username, form.password)
    setLoading(false)
    if (result.success) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-unimayor-gradient">
      {/* Panel izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 text-white">
        <div className="w-32 h-32 bg-white/15 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <GraduationCap size={64} className="text-white" />
        </div>
        <h1 className="font-heading text-5xl font-black mb-3 text-center">Unimayor</h1>
        <p className="text-white/80 text-xl text-center mb-2">Colegio Mayor del Cauca</p>
        <p className="text-white/60 text-center text-sm max-w-xs">
          Sistema Institucional de Gestión de Asistencia Académica
        </p>
        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          {[['Docentes', 'Gestión de clases'], ['Estudiantes', 'Registro ágil'], ['Reportes', 'Exportación']].map(([t, s]) => (
            <div key={t} className="bg-white/10 rounded-xl p-4">
              <p className="font-bold text-white">{t}</p>
              <p className="text-white/60 text-xs mt-1">{s}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho - Formulario */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 fade-in">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-unimayor-green-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="text-white" size={22} />
            </div>
            <div>
              <p className="font-heading font-bold text-unimayor-green-700">Unimayor</p>
              <p className="text-gray-500 text-xs">Colegio Mayor del Cauca</p>
            </div>
          </div>

          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">Iniciar sesión</h2>
          <p className="text-gray-500 text-sm mb-8">Sistema de Asistencia Académica</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Usuario o correo</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  className="input-field pl-9"
                  placeholder="usuario@unimayor.edu.co"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pl-9 pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : 'Ingresar al sistema'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2024 Colegio Mayor del Cauca · Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  )
}
