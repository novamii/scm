# サプライチェーンROIダッシュボード（プロセス1〜7）

食品メーカーのサプライチェーン（調達 → 製造 → 流通 → 循環）全体を可視化し、
プロセスごとのROI・KPI・ベンチマークを確認できるNext.jsダッシュボードです。

## 構成

```
app/
  layout.tsx        ルートレイアウト
  page.tsx           ダッシュボード本体（トップ／ミドル／ボトム層を組み立て）
  globals.css         Tailwindベース＋トークン
components/
  KpiBar.tsx           トップ層：全社ROIサマリー
  FlowDiagram.tsx       トップ層：7プロセスの全体フロー＋循環フィードバックループ
  ProcessGrid.tsx       ミドル層：7プロセスのカード一覧
  ProcessCard.tsx        個別プロセスカード
  ProcessModal.tsx       ベンチマーク比較モーダル（Recharts）
  BottomTrends.tsx      ボトム層：4大トレンドカード
lib/
  types.ts             Supabaseテーブルに対応する型定義（コメントでテーブル構成案を記載）
  schema.sql            Supabase用 CREATE TABLE 文
  supabaseClient.ts      Supabaseクライアント＋データ取得関数（未接続時はモックにフォールバック）
data/
  processData.ts         ベストプラクティス定義書から構造化したモックデータ
```

## スマホ完結ワークフロー

1. **StackBlitz**：このフォルダをZIPのままインポート、またはGitHubリポジトリ経由で開き、
   ブラウザ上でコード編集・プレビューを行う。
2. **Vercel**：StackBlitzからGitHub連携 → Vercelでインポートし、`vercel deploy` またはダッシュボードから
   ワンタップデプロイ。
3. **Supabase**：`lib/schema.sql` をSupabaseのSQL Editorで実行してテーブルを作成し、
   `.env.local`（`.env.local.example`を参考に作成）へ `NEXT_PUBLIC_SUPABASE_URL` /
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定するとモックから実データ取得へ自動切替。
4. **GitHub**：完成後にリポジトリへコミットしてバージョン管理。

## ローカル実行

```bash
npm install
npm run dev
```

## Supabase接続への切り替え

`lib/supabaseClient.ts` 内の各 `fetchXxx` 関数はコメントアウトされた実装例を含みます。
環境変数を設定すると `USE_MOCK` が自動的に `false` になり、コメントを外すだけで
Supabaseからの実データ取得に切り替えられます。
