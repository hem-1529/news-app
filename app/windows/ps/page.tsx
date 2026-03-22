'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type WindowsCommand = {
  id: number
  command: string
  description: string
  example: string
  category: string
  importance: number
  type: string
}

const COLOR_PALETTE = [
  { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   active: 'bg-blue-600 text-white hover:bg-blue-700',     inactive: 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50' },
  { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', active: 'bg-purple-600 text-white hover:bg-purple-700', inactive: 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-50' },
  { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    active: 'bg-red-600 text-white hover:bg-red-700',       inactive: 'bg-white text-red-600 border border-red-300 hover:bg-red-50' },
  { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200',  active: 'bg-green-600 text-white hover:bg-green-700',   inactive: 'bg-white text-green-600 border border-green-300 hover:bg-green-50' },
  { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', active: 'bg-orange-500 text-white hover:bg-orange-600', inactive: 'bg-white text-orange-500 border border-orange-300 hover:bg-orange-50' },
  { bg: 'bg-pink-50',   text: 'text-pink-700',   border: 'border-pink-200',   active: 'bg-pink-500 text-white hover:bg-pink-600',     inactive: 'bg-white text-pink-500 border border-pink-300 hover:bg-pink-50' },
  { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', active: 'bg-yellow-500 text-white hover:bg-yellow-600', inactive: 'bg-white text-yellow-600 border border-yellow-300 hover:bg-yellow-50' },
  { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200',   active: 'bg-teal-600 text-white hover:bg-teal-700',     inactive: 'bg-white text-teal-600 border border-teal-300 hover:bg-teal-50' },
  { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', active: 'bg-indigo-600 text-white hover:bg-indigo-700', inactive: 'bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-50' },
  { bg: 'bg-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200',   active: 'bg-cyan-600 text-white hover:bg-cyan-700',     inactive: 'bg-white text-cyan-600 border border-cyan-300 hover:bg-cyan-50' },
]

export default function PowerShellPage() {
  const [items, setItems] = useState<WindowsCommand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState('すべて')
  const [query, setQuery] = useState('')
  const [activeItem, setActiveItem] = useState<WindowsCommand | null>(null)

  const [categoryDefs, setCategoryDefs] = useState<string[]>([])

  const categories = useMemo(() => {
    const itemCats = new Set(items.map((item) => item.category))
    const ordered = categoryDefs.filter((name) => itemCats.has(name))
    const extra = Array.from(itemCats).filter((cat) => !categoryDefs.includes(cat)).sort()
    return ['すべて', ...ordered, ...extra]
  }, [items, categoryDefs])

  const colorMap = useMemo(
    () => Object.fromEntries(categories.slice(1).map((cat, i) => [cat, COLOR_PALETTE[i % COLOR_PALETTE.length]])),
    [categories],
  )

  useEffect(() => {
    async function fetchCommands() {
      const [commandsRes, categoriesRes] = await Promise.all([
        supabase.from('windows_commands').select('*').eq('type', 'ps').order('command', { ascending: true }),
        supabase.from('categories').select('name').eq('page_type', 'ps').order('sort_order', { ascending: true }),
      ])

      if (commandsRes.error) {
        setError(commandsRes.error.message)
      } else {
        setItems(commandsRes.data ?? [])
      }
      setCategoryDefs((categoriesRes.data ?? []).map((c) => c.name))
      setLoading(false)
    }

    fetchCommands()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveItem(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const filtered = items.filter((item) => {
    const matchesCategory = selected === 'すべて' || item.category === selected
    const q = query.trim()
    const matchesQuery =
      q === '' || item.command.includes(q) || item.description.includes(q)
    return matchesCategory && matchesQuery
  })

  const defaultColor = { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">PowerShellコマンド一覧</h1>
        <p className="text-gray-500 mb-8">カテゴリを選んで絞り込めます</p>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => {
            const isActive = selected === cat
            const color = colorMap[cat]
            const btnClass = cat === 'すべて'
              ? isActive
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              : isActive
                ? color.active
                : color.inactive
            return (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${btnClass}`}
              >
                {cat}
              </button>
            )
          })}
        </div>

        {/* Search box */}
        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="コマンドを検索..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-400">読み込み中...</div>
        )}

        {error && (
          <div className="text-center py-20 text-red-500">エラー: {error}</div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400">該当するコマンドが見つかりませんでした</div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((item) => {
              const colors = colorMap[item.category] ?? defaultColor
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`rounded-xl border ${colors.border} ${colors.bg} p-5 shadow-sm cursor-pointer hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="text-lg font-bold font-mono text-gray-800">{item.command}</span>
                    <span
                      className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${colors.text} bg-white border ${colors.border}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className="text-yellow-400 text-sm mb-2">
                    {'★'.repeat(item.importance)}
                    <span className="text-gray-200">{'★'.repeat(5 - item.importance)}</span>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {activeItem && (() => {
        const colors = colorMap[activeItem.category] ?? defaultColor
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setActiveItem(null)}
          >
            <div
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="閉じる"
              >
                ×
              </button>

              <div className="flex items-start gap-3 mb-4">
                <h2 className="text-2xl font-bold font-mono text-gray-800">{activeItem.command}</h2>
                <span
                  className={`shrink-0 mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${colors.text} ${colors.bg} border ${colors.border}`}
                >
                  {activeItem.category}
                </span>
              </div>

              <div className="text-yellow-400 text-lg mb-4">
                {'★'.repeat(activeItem.importance)}
                <span className="text-gray-200">{'★'.repeat(5 - activeItem.importance)}</span>
              </div>

              <p className="text-gray-700 leading-relaxed mb-5">{activeItem.description}</p>

              {activeItem.example && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">使用例</p>
                  <pre className="bg-gray-900 text-blue-300 text-sm rounded-lg px-4 py-3 overflow-x-auto font-mono whitespace-pre-wrap">
                    {activeItem.example}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
