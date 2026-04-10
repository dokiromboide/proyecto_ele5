import { useParams } from 'react-router-dom'
import { ClipboardCheck } from 'lucide-react'

export default function SessionPage() {
  const { id } = useParams()
  return (
    <div className="fade-in">
      <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ClipboardCheck className="text-unimayor-green-600" />
        Sesión #{id}
      </h2>
      <div className="card text-center py-12 text-gray-400">
        <p className="font-medium">Detalle de sesión</p>
        <p className="text-sm mt-1">El agente de frontend completará esta vista</p>
      </div>
    </div>
  )
}
