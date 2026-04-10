import { useState, useEffect } from 'react'
import { userService } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Users, Trash2, Search, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const roleLabel = { admin: 'Admin', docente: 'Docente', estudiante: 'Estudiante' }
const roleBadge = {
  admin:      'bg-purple-100 text-purple-700',
  docente:    'bg-blue-100   text-blue-700',
  estudiante: 'bg-green-100  text-green-700',
}
const roleIcon = { admin: ShieldCheck, docente: BookOpen, estudiante: GraduationCap }

export default function StudentsPage() {
  const { user: me } = useAuth()
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const data = await userService.listUsers()
      setUsers(data)
    } catch {
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (u) => {
    if (!window.confirm(`¿Eliminar a ${u.full_name}? Esta acción no se puede deshacer.`)) return
    setDeleting(u.id)
    try {
      await userService.deleteUser(u.id)
      toast.success(`${u.full_name} eliminado`)
      setUsers(prev => prev.filter(x => x.id !== u.id))
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Error al eliminar')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const students = filtered.filter(u => u.role === 'estudiante')
  const docentes = filtered.filter(u => u.role === 'docente')
  const admins   = filtered.filter(u => u.role === 'admin')

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
          <p className="text-gray-500 text-sm mt-1">
            {users.length} usuarios registrados
          </p>
        </div>
      </div>

      {/* Buscador */}
      <div className="card">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          <input
            className="input-field pl-9"
            placeholder="Buscar por nombre, usuario o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="card flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-unimayor-green-600" />
        </div>
      ) : (
        <>
          <UserTable title="Estudiantes" icon={GraduationCap} rows={students} me={me} onDelete={handleDelete} deleting={deleting} roleBadge={roleBadge} roleLabel={roleLabel} roleIcon={roleIcon} />
          <UserTable title="Docentes"    icon={BookOpen}       rows={docentes} me={me} onDelete={handleDelete} deleting={deleting} roleBadge={roleBadge} roleLabel={roleLabel} roleIcon={roleIcon} />
          {admins.length > 0 && (
            <UserTable title="Administradores" icon={ShieldCheck} rows={admins} me={me} onDelete={handleDelete} deleting={deleting} roleBadge={roleBadge} roleLabel={roleLabel} roleIcon={roleIcon} />
          )}
          {filtered.length === 0 && (
            <div className="card text-center py-12 text-gray-400">
              <Users size={40} className="mx-auto mb-3 opacity-40" />
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function UserTable({ title, icon: Icon, rows, me, onDelete, deleting, roleBadge, roleLabel }) {
  if (rows.length === 0) return null
  return (
    <div className="card">
      <h3 className="font-heading font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Icon size={18} className="text-unimayor-green-600" />
        {title} ({rows.length})
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Nombre</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Usuario</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Email</th>
              <th className="text-left py-2 px-3 text-gray-500 font-medium">Rol</th>
              {me?.role === 'admin' && <th className="py-2 px-3" />}
            </tr>
          </thead>
          <tbody>
            {rows.map(u => (
              <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-2.5 px-3 font-medium text-gray-900">{u.full_name}</td>
                <td className="py-2.5 px-3 text-gray-600">@{u.username}</td>
                <td className="py-2.5 px-3 text-gray-500">{u.email}</td>
                <td className="py-2.5 px-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role]}`}>
                    {roleLabel[u.role]}
                  </span>
                </td>
                {me?.role === 'admin' && (
                  <td className="py-2.5 px-3 text-right">
                    {u.id !== me.id && (
                      <button
                        onClick={() => onDelete(u)}
                        disabled={deleting === u.id}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                        title="Eliminar usuario"
                      >
                        {deleting === u.id
                          ? <div className="animate-spin h-4 w-4 border-b-2 border-red-500 rounded-full" />
                          : <Trash2 size={16} />}
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
