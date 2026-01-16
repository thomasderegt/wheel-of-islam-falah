/**
 * Auth Feature Public API
 * Export only what other features/app need
 */

export { useAuth } from './hooks/useAuth'
export { useLogin } from './hooks/useLogin'
export { useRegister } from './hooks/useRegister'
export { useLogout } from './hooks/useLogout'
export { LoginForm } from './components/LoginForm'
export { RegisterForm } from './components/RegisterForm'
export { ProtectedRoute } from './components/ProtectedRoute'
export type { User, AuthState } from './types'

