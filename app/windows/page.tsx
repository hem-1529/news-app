import Link from 'next/link'

const SHELLS = [
  {
    href: '/windows/ps',
    title: 'PowerShell',
    abbr: 'PS',
    description: 'Windowsの高機能シェル。オブジェクト指向のパイプラインを使い、システム管理・自動化タスクに強い。',
    color: 'border-blue-200 hover:border-blue-400',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    href: '/windows/cmd',
    title: 'コマンドプロンプト',
    abbr: 'CMD',
    description: 'Windowsの伝統的なコマンドラインインターフェース。バッチファイルや基本的なシステム操作に使われる。',
    color: 'border-gray-200 hover:border-gray-400',
    badge: 'bg-gray-100 text-gray-700',
  },
]

export default function WindowsIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Windowsコマンド</h1>
        <p className="text-gray-500 mb-10">シェルを選んでください</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {SHELLS.map(({ href, title, abbr, description, color, badge }) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-2xl border-2 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${color}`}
            >
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-3 ${badge}`}>
                {abbr}
              </span>
              <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
