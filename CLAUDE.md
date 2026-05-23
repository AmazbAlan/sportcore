# SPORTCORE — Frontend (sportcore.kg)

Витрина-каталог спортивных товаров в Бишкеке. Заказы оформляются в WhatsApp,
склад и БД — Supabase. Это публичная часть; админка живёт в отдельном репо
`sportcore.crm` и работает с той же Supabase.

## Stack
- Next.js 14 (App Router), TypeScript, React 18
- Supabase (Postgres) — единственный бэкенд, обращение через REST (`/rest/v1/...`)
- Vercel — деплой (домен sportcore.kg)
- Tailwind CSS
- Groq API (llama-3.3-70b) — для AI-заполнения карточек товаров через CRM

## Структура
- `frontend/app/` — страницы (App Router) и API routes
  - `page.tsx` — главная (баннер, категории, хиты)
  - `category/[slug]/page.tsx` — листинг товаров в категории
  - `product/[slug]/page.tsx` — карточка товара со Schema.org разметкой
  - `cart/`, `checkout/` — корзина (клиентский стейт) и оформление
  - `search/page.tsx` — поиск
  - `api/checkout/route.ts` — пишет заказ в `sales` + `sale_items`, списывает остатки
  - `api/generate-product/route.ts` — proxy к Groq для генерации карточек (вызывает CRM)
  - `api/categories/route.ts` — публичный список категорий
  - `api/sitemap/`, `sitemap.ts`, `robots.ts` — SEO
- `frontend/lib/api.ts` — ВСЕ запросы к Supabase из server components, типы Product/Category
- `frontend/app/context/CartContext.tsx` — корзина в React state (не персистится в БД, только клиент)
- `frontend/app/components/` — переиспользуемые UI-компоненты

## Команды
- `cd frontend && npm run dev` — локально на http://localhost:3000
- `npm run build` — прод-сборка (проверяет TS и линт)
- `npm run lint` — eslint
- `vercel --prod` — деплой (автодеплой настроен на push в main)

## Env (Vercel + .env.local)
- `NEXT_PUBLIC_SUPABASE_URL` — публичный URL проекта Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key (используется и на клиенте, и на сервере)
- `GROQ_API_KEY` — ТОЛЬКО серверный, для `/api/generate-product`. Не префиксить `NEXT_PUBLIC_`!

## Схема БД (Supabase)
- `products` — id, name, slug (UNIQUE), price, qty, category, category_slug, description (jsonb),
  image_url, seo_title, seo_desc, featured (boolean), variants (jsonb), updated_at
- `categories` — id, name, slug, image_url, featured, updated_at
- `sales` — id, total, customer_name, customer_phone, customer_address, source ('site'|'crm'), created_at
- `sale_items` — id, sale_id (FK), product_id (FK), product_name, price, qty

RPC: `decrement_product_qty(p_id, p_amount)` — атомарное списание остатка с проверкой.

## Связка с CRM
Отдельный репозиторий `sportcore.crm` (single HTML, деплой на sportcore-crm.vercel.app)
работает с **той же Supabase**. Любая правка схемы БД ломает CRM — синхронизировать
изменения вручную в обоих репо.

CRM единственная пишет в `products` (CREATE/UPDATE/DELETE), сайт только читает
оттуда. Исключение: `/api/checkout` уменьшает `qty` при оформлении заказа и
пишет в `sales` + `sale_items` (это видно в CRM «История продаж» с source='site').

## Конвенции
- **Товары без `slug` НЕ показываются на сайте** (см. `isPublishable` в `lib/api.ts`).
  Это защита от карточек, которые ведут на `/product/undefined` → 404.
- **Категория хранится в двух полях**: `category` (legacy, для CRM) и `category_slug`
  (для URL сайта). Обновлять ОБА. `getProductsByCategory` ищет по `or=(category_slug, category)`.
- **slug должен быть на латинице через дефис** (транслит русского). См. функцию
  `makeSlug` в CRM. Уникальность гарантирована индексом БД.
- **`qty` — единое поле остатка** для CRM и сайта. Не путать с `variants[].stock`
  (последнее — для будущей системы размеров/цветов, сейчас почти не используется).
- **description хранится как jsonb блоков** формата `[{ children: [{ text: '...' }] }]`
  (legacy от Strapi). Извлекать через `extractText()` в `product/[slug]/page.tsx`.
- `next: { revalidate: 60 }` на запросах к Supabase — кэш на 1 минуту. Не ставить
  больше, иначе изменения из CRM долго доходят до сайта.
- `revalidate = 3600` на страницах — ISR на час, страница пересобирается по запросу.

## Не трогать без согласования
- `public/` — оптимизированные картинки товаров и категорий
- Schema.org JSON-LD на `product/[slug]/page.tsx` и `category/[slug]/page.tsx` —
  настроено под Google Merchant и поисковики
- `sitemap.ts`, `robots.ts` — SEO

## Известные особенности / подводные камни
- `CartContext` живёт только в React state — при F5 корзина теряется. Это намеренно
  для текущего UX (заказ всегда уходит в WhatsApp в той же сессии).
- WhatsApp-номер для заказов захардкожен в `app/checkout/page.tsx`: `+996774231202`.
- `/api/checkout` — между чтением `qty` и `PATCH` теоретически возможна гонка.
  Для полной защиты использовать RPC `decrement_product_qty` (см. миграцию).
- CORS на `/api/generate-product` разрешает только `sportcore-crm.vercel.app`,
  `localhost:3000` и `file://`. При смене домена CRM — обновить `ALLOWED_ORIGINS`.

## Стиль кода
- TypeScript строгий не везде — есть `any` в местах обращения к Supabase (row маппится через `toProduct`).
- Server Components по умолчанию; `'use client'` только где нужно (формы, состояние, события).
- Tailwind utility-first, без отдельных CSS-модулей.
- Файлы компонентов в PascalCase, route-файлы строго `page.tsx` / `route.ts` / `layout.tsx`.