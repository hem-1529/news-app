'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type GitCommand = {
  id: number
  command: string
  description: string
  example: string
  category: string
  importance: number
}

const CATEGORIES = [
  'すべて',
  '基本操作',
  'ブランチ',
  'リモート',
  '履歴確認',
  '取り消し',
  'タグ',
  '設定',
]

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  基本操作: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  ブランチ: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  リモート: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  履歴確認: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  取り消し: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  タグ: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  設定: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
}

const CATEGORY_BUTTON_COLORS: Record<string, string> = {
  すべて: 'bg-gray-600 text-white hover:bg-gray-700',
  基本操作: 'bg-blue-600 text-white hover:bg-blue-700',
  ブランチ: 'bg-purple-600 text-white hover:bg-purple-700',
  リモート: 'bg-green-600 text-white hover:bg-green-700',
  履歴確認: 'bg-orange-500 text-white hover:bg-orange-600',
  取り消し: 'bg-red-600 text-white hover:bg-red-700',
  タグ: 'bg-yellow-500 text-white hover:bg-yellow-600',
  設定: 'bg-teal-600 text-white hover:bg-teal-700',
}

const CATEGORY_BUTTON_INACTIVE: Record<string, string> = {
  すべて: 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50',
  基本操作: 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50',
  ブランチ: 'bg-white text-purple-600 border border-purple-300 hover:bg-purple-50',
  リモート: 'bg-white text-green-600 border border-green-300 hover:bg-green-50',
  履歴確認: 'bg-white text-orange-500 border border-orange-300 hover:bg-orange-50',
  取り消し: 'bg-white text-red-600 border border-red-300 hover:bg-red-50',
  タグ: 'bg-white text-yellow-600 border border-yellow-300 hover:bg-yellow-50',
  設定: 'bg-white text-teal-600 border border-teal-300 hover:bg-teal-50',
}

export default function GitPage() {
  const [items, setItems] = useState<GitCommand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState('すべて')
  const [query, setQuery] = useState('')
  const [activeItem, setActiveItem] = useState<GitCommand | null>(null)

  useEffect(() => {
    async function fetchCommands() {
      const { data, error } = await supabase
        .from('git_commands')
        .select('*')
        .order('command', { ascending: true })

      if (error) {
        setError(error.message)
      } else {
        setItems(data ?? [])
      }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gitコマンド一覧</h1>
        <p className="text-gray-500 mb-8">カテゴリを選んで絞り込めます</p>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selected === cat
                  ? CATEGORY_BUTTON_COLORS[cat]
                  : CATEGORY_BUTTON_INACTIVE[cat]
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search box */}
        <div className="mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="コマンドを検索..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
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
              const colors = CATEGORY_COLORS[item.category] ?? {
                bg: 'bg-gray-50',
                text: 'text-gray-700',
                border: 'border-gray-200',
              }
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
        const colors = CATEGORY_COLORS[activeItem.category] ?? {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-200',
        }
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
                  <pre className="bg-gray-900 text-green-400 text-sm rounded-lg px-4 py-3 overflow-x-auto font-mono whitespace-pre-wrap">
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
