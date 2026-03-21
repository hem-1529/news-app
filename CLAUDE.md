@AGENTS.md

## Project Overview

- **App:** news-app
- **Framework:** Next.js 16.2.0 (App Router / TypeScript / Tailwind CSS v4)
- **Runtime:** React 19.2.4
- **Local:** ~/news-app (WSL2)
- **Production:** https://news-app-six-lilac.vercel.app
- **GitHub:** https://github.com/hem-1529/news-app
- **Deploy:** Vercel (auto-deploy on push to main)

## Features

1. **RSS News Feed** (`/`)
   - Aggregates articles from Zenn (`https://zenn.dev/feed`) and Qiita (`https://qiita.com/popular-items/feed`)
   - Supports both RSS 2.0 and Atom formats
   - Async Server Component with 1-hour cache (`revalidate: 3600`)
   - Fallback UI on feed failure via `Promise.allSettled()`

2. **IT Certification Glossary** (`/glossary`)
   - `/glossary/fe`: 基本情報技術者試験 (FE exam)
   - `/glossary/ap`: 応用情報技術者試験 (AP exam)
   - Category filter (8 types), full-text search (term + description), importance stars
   - Modal detail view on term click (close with ESC)

## Directory Structure

```
news-app/
├── app/
│   ├── layout.tsx          # Root layout (Geist font, Header)
│   ├── page.tsx            # Home (news feed)
│   ├── globals.css         # Tailwind v4 global styles (dark mode)
│   ├── components/
│   │   ├── Header.tsx      # Navigation (active link via usePathname)
│   │   └── NewsFeed.tsx    # RSS feed display (async Server Component)
│   └── glossary/
│       ├── page.tsx        # Exam selection page
│       ├── fe/page.tsx     # FE glossary (Client Component)
│       └── ap/page.tsx     # AP glossary (Client Component)
├── lib/
│   ├── rss.ts              # RSS parser (Article type, fetchFeed)
│   └── supabase.ts         # Supabase client
├── next.config.ts
├── tsconfig.json           # strict mode, @/* path alias
├── postcss.config.mjs
└── eslint.config.mjs
```

## Database (Supabase)

- **Region:** Tokyo
- **Access:** Client-side via `NEXT_PUBLIC_*` env vars (no API routes)
- **Table:** `glossary`

| Column | Type | Description |
|---|---|---|
| term | text | 用語名 |
| reading | text | 読み仮名 |
| description | text | 説明文 |
| category | text | ハードウェア/ソフトウェア/ネットワーク/データベース/セキュリティ/アルゴリズム/経営戦略/システム開発 |
| importance | int | 1–5 |
| level | text | `fe` / `ap` (planned: `sc` / `mg` / `da` / `sy`) |
| created_at | timestamp | |

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://luvzpmjphconebtvkivt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=(public anon key)
```

## Dev Commands

```bash
npm run dev    # start dev server
npm run build  # production build
npm run start  # start production server
npm run lint   # run ESLint
```

## Development Rules

- Push to main → auto-deploy to Vercel
- Commit messages: Japanese OK, use prefixes: `feat:` / `fix:` / `docs:` / `refactor:` / `chore:`
- Always verify `npm run build` passes locally before pushing production changes
- Glossary pages = Client Components (`'use client'`), news feed = async Server Component

## 報告ルール

- 作業の開始・完了・エラー発生時・重要なお知らせ時はVOICEVOXのずんだもん（speaker ID: 3）の声で音声報告する
- 報告は短く端的に、ずんだもん口調（「〜なのだ」）で行う
- VOICEVOXに送信するテキスト内の英単語は適切なカタカナに変換する（例: error→エラー、file→ファイル、complete→コンプリート）
- VOICEVOXに送信するテキストは不要なスペースを削除する
- 長い作業中は進捗を中間報告する
