# Fitness CRM

fitnessのCRM(会員管理) WEBアプリ

# 技術スタック

| カテゴリ       | 採用技術                 | 備考                                                       |
| :------------- | :----------------------- | :--------------------------------------------------------- |
| 実行環境       | Node.js                  | v24以上を推奨                                              |
| 言語           | TypeScript               | 全域での型安全性の担保                                     |
| フレームワーク | Next.js                  | App Router採用                                             |
| UIライブラリ   | shadcn/ui                | Tailwind CSSベースのコンポーネント                         |
| 構文チェック   | ESLint                   | コード品質の自動チェック                                   |
| 自動整形       | Prettier                 | チーム間でのコードスタイルの統一 <br> import順の自動ソート |
| コミット制御   | husky <br /> lint-staged | コミット時のLint/Formatterの自動実行                       |

# Getting Started

## インストール

```bash
npm install
```

`npm install` 時にhusky(Git hooks)も自動でセットアップされます。

## 開発サーバの起動

```bash
npm run dev
```

起動後、 [http://localhost:3000](http://localhost:3000) にアクセスしてください。

# Linter / Formatter

LinterとFormatterはcommit時に自動実行されます。
プロジェクト全体に適用したい場合は手動で実行してください。

- ESLint
  - 設定ファイル: [eslint.config.mjs](./eslint.config.mjs)
  - 手動実行: `npm run lint`
- Prettier
  - 設定ファイル: [prettier.config.mjs](./prettier.config.mjs)
  - 手動実行: `npm run format`
