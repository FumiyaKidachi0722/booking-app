# Universal Booking System (Next.js + Firestore + shadcn/ui)

汎用予約システムのリファレンス実装。  
クリーンアーキテクチャ × Atomic Design、DB は Firebase Firestore、UI は shadcn/ui。

## 特長

- **二重予約防止**：スロット離散化（デフォルト 15 分）× Firestore トランザクション
- **Config-as-Data**：pricing / cancellation などを階層＋バージョン管理、公開版のみ適用
- **スキーマ拡張**：業態固有データを JSON（`extra`）で安全に保持（Schema Registry+Zod）
- **UI/UX**：shadcn/ui（Radix）でアクセシビリティと一貫性を担保

---

## ディレクトリ

```

src/
app/                 # Next.js App Router
reserve/page.tsx
api/
reservations/route.ts
config/preview/route.ts
components/          # Atomic Design（UIはshadcn）
server/              # クリーンアーキテクチャ層（サーバ専用）
shared/
constants/         # ← 定数の単一ソース
types/             # ← 型の単一ソース（API/ドメイン/Config）
lib/

```

---

## 必要要件

- Node.js 22+
- Firebase プロジェクト（サービスアカウント）
- Tailwind / shadcn セットアップ

### 環境変数

`.env.local` に以下を設定：

```

FIREBASE\_PROJECT\_ID=your-project-id
FIREBASE\_CLIENT\_EMAIL=[your-service-account@your-project.iam.gserviceaccount.com](mailto:your-service-account@your-project.iam.gserviceaccount.com)
FIREBASE\_PRIVATE\_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

```

※ `\n` を改行に**必ず**復元してください。

---

## インストール

```bash
pnpm install # または npm/yarn
```

### Tailwind & shadcn

- `tailwind.config.ts` の `content` に `./src/**/*.{ts,tsx}` を指定
- `globals.css` に shadcn の base スタイル適用
- 追加 UI は `npx shadcn@latest add button input form popover calendar card toast` などで導入

---

## Firestore 初期データ

最低限の published 設定を作成します（例）：

- `configs/pricing/versions/{v}`（global または tenant 階層に作成）

```json
{
  "published": true,
  "validFrom": "2025-08-01T00:00:00.000Z",
  "version": 1,
  "payload": {
    "currency": "JPY",
    "rounding": "floor",
    "serviceRate": 0.1,
    "taxRate": 0.1,
    "rules": [
      {
        "id": "set_19_21",
        "name": "19-21時セット",
        "when": { "time": { "startMin": 1140, "endMin": 1260 } },
        "calc": [{ "kind": "per_time", "unitMin": 60, "unitPrice": 4000 }],
        "priority": 10
      }
    ]
  }
}
```

- `configs/cancellation/versions/{v}`

```json
{
  "published": true,
  "validFrom": "2025-08-01T00:00:00.000Z",
  "version": 1,
  "payload": {
    "tiersAsc": [
      { "thresholdMin": 1440, "fee": { "kind": "percent", "rate": 0 } },
      { "thresholdMin": 120, "fee": { "kind": "percent", "rate": 0.5 } }
    ],
    "noShow": { "kind": "percent", "rate": 1.0 },
    "boundaryRule": "gte"
  }
}
```

- テナント・リソース（例）

```
/tenants/t1
/tenants/t1/resources/res1
/tenants/t1/services/svc1
```

---

## 起動

```bash
pnpm dev
# http://localhost:3000/reserve へアクセス
```

---

## API

### POST `/api/reservations`

**ヘッダ**: `Idempotency-Key: <ランダム文字列>`
**Body**:

```json
{
  "tenantId": "t1",
  "locationId": "loc1",
  "resourceId": "res1",
  "serviceId": "svc1",
  "customerId": "c1",
  "startAtUTC": "2025-08-24T10:00:00.000Z",
  "durationMin": 60,
  "people": 2
}
```

**200**:

```json
{ "reservationId": "xxxx", "amount": 5500, "cancelFeePreview": 0 }
```

**409**: スロット競合
**400**: 入力不正

---

## 設計の要点

- **定数/型の一元管理**：`src/shared/constants/*` と `src/shared/types/*` を**唯一の参照元**にし、API・UC・UI で共有
- **トランザクション安全性**：スロット doc に `reservedBy` を書き込み、存在時は競合
- **Config-as-Data**：公開版のみ参照し、予約確定時はバージョンタグを**スナップショット**に保存
- **拡張**：キャンセル/延長 API・Schema Registry UI は同構成で追加が容易

---

## セキュリティ

- 予約や在庫の**書込みはサーバのみ**（Admin SDK）。
- カスタムクレーム `tenantId`, `roles[]` を Firestore ルールで強制。
- 返金/免除などの危険操作は 2 者承認＋監査ログ推奨。

---

## テスト

- Unit: UseCase（Port モック）
- Integration: Firestore Emulator（Tx 競合/冪等）
- E2E: Playwright（/reserve → 予約作成 → トースト）

---

## ライセンス

MIT（任意に変更可）
