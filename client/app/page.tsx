'use client'

import { API_BASE_URL } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { useEffect, useState } from 'react'
import LoginPage from './login/page'

interface Market {
  id: number
  name: string
  description: string | null
  createdAt: string
  userId: number
}

export default function Home() {
  const { user, token, logout } = useAuthStore()
  const [markets, setMarkets] = useState<Market[]>([])
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    fetch(`${API_BASE_URL}/markets`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setMarkets(data)
      })
      .catch(console.error)
  }, [token])

  const handleLogout = async () => {
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    }
    logout()
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !token) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${API_BASE_URL}/markets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, description: newDesc || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create market')
        return
      }
      setMarkets((prev) => [...prev, data])
      setNewName('')
      setNewDesc('')
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE_URL}/markets/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return
      setMarkets((prev) => prev.filter((m) => m.id !== id))
    } catch {
      console.error('Delete failed')
    }
  }

  if (!user) return <LoginPage />

  const isAdmin = user.role === 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">Prediction Markets</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.name ?? user.email}
              {isAdmin && <span className="ml-2 rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">ADMIN</span>}
            </span>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        {isAdmin && (
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Create Market</h2>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Market name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Market'}
              </button>
            </form>
          </section>
        )}

        <section className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Markets ({markets.length})</h2>
          </div>
          {markets.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-500">No markets yet.</p>
          ) : (
            <ul className="divide-y">
              {markets.map((m) => (
                <li key={m.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{m.name}</p>
                    {m.description && <p className="mt-0.5 text-sm text-gray-500">{m.description}</p>}
                    <p className="mt-1 text-xs text-gray-400">
                      Created {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
