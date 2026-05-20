import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = sessionStorage.getItem('tv_admin_auth') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return children
}
