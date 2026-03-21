import Link from 'next/link'

const EXAMS = [
  {
    href: '/glossary/fe',
    title: '基本情報技術者試験',
    abbr: 'FE',
    description: 'ITエンジニアの登竜門。アルゴリズム・ハードウェア・ネットワークなど幅広い基礎知識を学ぶ。',
    color: 'border-blue-200 hover:border-blue-400',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    href: '/glossary/ap',
    title: '応用情報技術者試験',
    abbr: 'AP',
    description: '基本情報の上位資格。より高度な技術・マネジメント・ストラテジの知識が問われる。',
    color: 'border-purple-200 hover:border-purple-400',
    badge: 'bg-purple-100 text-purple-700',
  },
]

export default function GlossaryIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">用語集</h1>
        <p className="text-gray-500 mb-10">試験を選んでください</p>

        <div className="grid gap-6 sm:grid-cols-2">
          {EXAMS.map(({ href, title, abbr, description, color, badge }) => (
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
