import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Páginas
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AttendancePage from './pages/AttendancePage'
import SessionPage from './pages/SessionPage'
import ReportsPage from './pages/ReportsPage'
import StudentsPage from './pages/StudentsPage'
import CoursesPage from './pages/CoursesPage'

// Layout
import MainLayout from './components/layout/MainLayout'

function ProtectedRoute({ children, roles }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-unimayor-green-600" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="attendance/session/:id" element={<SessionPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="students" element={
            <ProtectedRoute roles={['admin', 'docente']}>
              <StudentsPage />
            </ProtectedRoute>
          } />
          <Route path="courses" element={
            <ProtectedRoute roles={['admin', 'docente']}>
              <CoursesPage />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
