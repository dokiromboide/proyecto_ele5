import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor: agregar token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor: manejar 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ---- Auth ----
export const authService = {
  login: async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password })
    return data
  },
  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    return data
  },
  getProfile: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },
}

// ---- Usuarios ----
export const userService = {
  listUsers: async () => {
    const { data } = await api.get('/users')
    return data
  },
  deleteUser: async (userId) => {
    await api.delete(`/users/${userId}`)
  },
}

// ---- Asistencia ----
export const attendanceService = {
  // Original (crear sesión por código)
  createSession: async (sessionData) => {
    const { data } = await api.post('/attendance/sessions', sessionData)
    return data
  },
  markAttendance: async (sessionCode, studentCode) => {
    const { data } = await api.post('/attendance/mark', { session_code: sessionCode, student_code: studentCode })
    return data
  },
  getSessionRecords: async (sessionId) => {
    const { data } = await api.get(`/attendance/sessions/${sessionId}/records`)
    return data
  },
  closeSession: async (sessionId) => {
    const { data } = await api.patch(`/attendance/sessions/${sessionId}/close`)
    return data
  },
  // Electiva 5 simplificada
  getElectiva5: async () => {
    const { data } = await api.get('/attendance/electiva5')
    return data
  },
  markElectiva5: async (studentId, status) => {
    const { data } = await api.post('/attendance/electiva5/mark', { student_id: studentId, status })
    return data
  },
}

// ---- Dashboard ----
export const dashboardService = {
  getStats: async () => {
    const { data } = await api.get('/dashboard/stats')
    return data
  },
}

// ---- Reportes ----
export const reportService = {
  getCourseSummary: async (courseId) => {
    const { data } = await api.get(`/reports/course/${courseId}/summary`)
    return data
  },
  downloadExcel: async (courseId, courseName) => {
    const response = await api.get(`/reports/course/${courseId}/excel`, { responseType: 'blob' })
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `asistencia_${courseName}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  },
}

export default api
