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

# Codebase Overview

## 1. Operating Modes

- **`npm run dev`**: Start development mode with automatic route generation and file watching
- **`npm run build`**: Build the application (includes automatic route generation)
- **`npm run start`**: Start the production server
- **`npm run generate-routes`**: Manually generate routes configuration
- **`npm run generate-api`**: Generate API client from backend OpenAPI spec
- **`npm run generate-client`**: Generate API client from remote API endpoint

## 2. OpenAPI

- First, get familiar with the `hey-api` library being used ([documents](https://heyapi.dev/openapi-ts/get-started)).

- To generate API definition files from `hey-api`, we have two methods:
  - Use the command **`npm run generate-api`**: This command will call your backend server to connect to the `openapi.json` file.
  - Use the command **`npm run generate-client`**: Before using this, ensure that you have the **`openapi.json`** file saved in **`src/lib/`**. This command will take the schemas in the `openapi.json` file to generate API definition files.

- Usage:

```ts
const { data, error } = useQuery({
  ...getPetByIdOptions({
    path: {
      petId: 1,
    },
  }),
});

const { data, error } = useInfiniteQuery({
  ...getFooInfiniteOptions({
    path: {
      fooId: 1,
    },
  }),
  getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  initialPageParam: 0,
});

const addPet = useMutation({
  ...addPetMutation(),
});

addPet.mutate({
  body: {
    name: 'Kitty',
  },
});
```

## 3. Route Generation

This project uses an automatic route generation system that scans your app directory and creates type-safe route configurations. This eliminates the need for manual route definitions and provides full TypeScript support.

### Features

- **Type-Safe Navigation**: Full IntelliSense and compile-time checking
- **Auto-Detection**: Automatically detects pages in your app directory
- **Route Groups Support**: Supports Next.js route groups `(public)`, `(private)`, `(shared)`
- **Dynamic Routes**: Handles static, dynamic, and catch-all routes
- **Development Watching**: Automatically regenerates routes when you add/remove pages

### Route Groups

- **`(public)`**: Public routes accessible without authentication
- **`(private)`**: Private routes requiring authentication
- **`(shared)`**: Routes accessible in any authentication state

### Usage Example

```typescript
import { isPrivateRoute, navigate } from '@/lib/routes/routes.util';

// Type-safe navigation
const profileUrl = navigate('/profile'); // '/profile'
const isPrivate = isPrivateRoute('/profile'); // true
```

### Generated Files

The system generates 3 files in `src/lib/routes/`:

- `routes.config.ts`: Route configuration object
- `routes.type.ts`: TypeScript type definitions
- `routes.util.ts`: Utility functions for navigation

> 📖 **Detailed Documentation**: See [Route Generator README](src/lib/routes/README.md) for complete usage guide and API reference.

## 4. How to Declare a New Page

With the automatic route generation system, creating new pages is simplified. Just create the page file in the appropriate route group directory, and the routes will be automatically generated.

### Route Groups Structure

- **`(public)`**: For public pages (login, signup, landing pages)
- **`(private)`**: For authenticated user pages (dashboard, profile, settings)
- **`(shared)`**: For pages accessible in any authentication state (home, about)

### Steps to Create a New Page

1. **Choose the appropriate route group** based on authentication requirements:
   - Public routes → `src/app/(public)/`
   - Private routes → `src/app/(private)/`
   - Shared routes → `src/app/(shared)/`

2. **Create the page directory and file** following Next.js conventions:

   ```bash
   # For a private user profile page
   mkdir -p src/app/\(private\)/profile
   touch src/app/\(private\)/profile/page.tsx

   # For a public login page
   mkdir -p src/app/\(public\)/login
   touch src/app/\(public\)/login/page.tsx
   ```

3. **Implement your page component**:

   ```tsx
   // src/app/(private)/profile/page.tsx
   export default function ProfilePage() {
     return (
       <div>
         <h1>Profile Page</h1>
         {/* Your page content */}
       </div>
     );
   }
   ```

4. **Routes are automatically generated** - the system will detect your new page and update:
   - `src/lib/routes/routes.config.ts`
   - `src/lib/routes/routes.type.ts`
   - `src/lib/routes/routes.util.ts`

### Dynamic Routes

Create dynamic routes using Next.js standard patterns:

```bash
# Dynamic route: /users/[id]
mkdir -p src/app/\(private\)/users/[id]
touch src/app/\(private\)/users/[id]/page.tsx

# Catch-all route: /blog/[...slug]
mkdir -p src/app/\(shared\)/blog/[...slug]
touch src/app/\(shared\)/blog/[...slug]/page.tsx
```

### Navigation

Use the type-safe `navigate` function for programmatic navigation:

```typescript
import { navigate } from '@/lib/routes/routes.util';

// Static routes
const homeUrl = navigate('/'); // '/'

// Dynamic routes with parameters
const userUrl = navigate('/users/[id]', '123'); // '/users/123'

// In components with Next.js Link or router.push
<Link href={navigate('/profile')}>Profile</Link>
```

> **Note**: Routes are automatically regenerated when you start the dev server or run `npm run generate-routes`. No manual configuration needed!
