"use client"
import { useAuth } from '@/lib/auth'

export default function HeaderNav() {
  const { role, displayName, logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-1 focus:rounded-md"
      >
        Skip to content
      </a>
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div aria-hidden className="h-6 w-6 rounded-md bg-black" />
          <span className="font-medium">Healthcare</span>
        </div>
        <nav aria-label="Primary" className="flex items-center gap-4 md:gap-6 text-sm">
          {(role === 'admin' || role === 'doctor' || role === 'staff') && (
            <a href="/dashboard" className="hover:text-black transition-colors">Home</a>
          )}
          {(role === 'admin' || role === 'staff') && (
            <>
              <a href="/patients" className="hover:text-black transition-colors">Patients</a>
              <a href="/doctors" className="hover:text-black transition-colors">Doctors</a>
              <a href="/appointments" className="hover:text-black transition-colors">Appointments</a>
            </>
          )}
          {role === 'patient' && (
            <>
              <a href="/appointments" className="hover:text-black transition-colors">My Appointments</a>
              <a href="/doctors" className="hover:text-black transition-colors">Browse Doctors</a>
            </>
          )}
          {role === 'doctor' && (
            <a href="/appointments" className="hover:text-black transition-colors">My Schedule</a>
          )}
          {!role && (
            <>
              <a href="/patients" className="hover:text-black transition-colors">Patients</a>
              <a href="/doctors" className="hover:text-black transition-colors">Doctors</a>
              <a href="/appointments" className="hover:text-black transition-colors">Appointments</a>
            </>
          )}
          {role ? (
            <button onClick={logout} className="hover:text-black transition-colors">Logout{displayName ? ` (${displayName})` : ''}</button>
          ) : (
            <>
              <a href="/staff" className="hover:text-black transition-colors">Staff</a>
              <a href="/login" className="hover:text-black transition-colors">Login</a>
              <a href="/register" className="hover:text-black transition-colors">Register</a>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
