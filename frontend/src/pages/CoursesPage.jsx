import { BookOpen, Plus } from 'lucide-react'

export default function CoursesPage() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-gray-900">Materias</h2>
          <p className="text-gray-500 text-sm mt-1">Gestión de cursos y asignaciones</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Agregar materia
        </button>
      </div>
      <div className="card">
        <div className="text-center py-12 text-gray-400">
          <BookOpen size={48} className="mx-auto mb-3 opacity-50" />
          <p className="font-medium">Módulo en desarrollo</p>
          <p className="text-sm">El agente de frontend completará este módulo</p>
        </div>
      </div>
    </div>
  )
}
