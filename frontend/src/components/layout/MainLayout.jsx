import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LayoutDashboard, ClipboardCheck, BarChart3,
  Users, BookOpen, LogOut, Menu, X, GraduationCap
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'docente', 'estudiante'] },
  { to: '/attendance', icon: ClipboardCheck, label: 'Asistencia', roles: ['admin', 'docente', 'estudiante'] },
  { to: '/reports', icon: BarChart3, label: 'Reportes', roles: ['admin', 'docente'] },
  { to: '/students', icon: Users, label: 'Estudiantes', roles: ['admin', 'docente'] },
  { to: '/courses', icon: BookOpen, label: 'Materias', roles: ['admin', 'docente'] },
]

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const visibleItems = navItems.filter(item => item.roles.includes(user?.role))

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-unimayor-gradient flex flex-col shadow-xl`}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-white/20">
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white" size={22} />
          </div>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="text-white font-heading font-bold text-sm leading-tight">Unimayor</p>
              <p className="text-white/60 text-xs truncate">Colegio Mayor del Cauca</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {visibleItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''} ${!sidebarOpen ? 'justify-center' : ''}`
              }
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User & logout */}
        <div className="p-3 border-t border-white/20">
          {sidebarOpen && (
            <div className="mb-2 px-2">
              <p className="text-white text-sm font-medium truncate">{user?.full_name}</p>
              <p className="text-white/60 text-xs capitalize">{user?.role}</p>
            </div>
          )}
          <button
            onClick={logout}
            className={`sidebar-link w-full text-red-300 hover:text-red-100 hover:bg-red-500/20 ${!sidebarOpen ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-3 flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-unimayor-green-600 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div>
            <h1 className="font-heading font-bold text-unimayor-green-700 text-lg leading-none">
              Sistema de Asistencia
            </h1>
            <p className="text-gray-500 text-xs">Colegio Mayor del Cauca</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
