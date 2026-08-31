// ============================================================================
// lib/types.ts
// Supabase (PostgreSQL) の3テーブル構成に対応する型定義。
// UIコンポーネントはこれらの型のみに依存し、取得元（fetch/mock）を意識しない。
// ============================================================================

/** 6層構造エビデンスチェーンにおける投資判断レイヤーの主要指標 */
export interface FinancialLayer {
  capexOku: number; // CAPEX（億円）
  opexOkuPerYear: number; // 年間OPEX（億円）
  opexNature: "system" | "hardware"; // OPEXの性質別分離（システム系15% / ハードウェア系5%）
  netImpactOkuPerYear: number; // Net Impact（億円/年）
  ebitRoiPercent: number; // EBIT ROI（%）
  staticPaybackYears: number; // 静的投資回収期間（年）
  effectivePaybackYears: number; // 実効回収期間（Time-to-Value反映後、年）
  timeToValueMonths: number; // 効果発現タイミング（T+Xヶ月）
}

/** 自社実績 vs 業界平均のベンチマーク項目（1プロセス1〜2項目） */
export interface BenchmarkMetric {
  id: string;
  label: string; // 例：「検査精度」「OEE」「在庫回転率」
  unit: string; // 例："%", "pt", "回/年"
  companyValue: number; // 自社実績（想定値／シミュレーション値）
  industryAvg: number; // 業界平均（ベンチマーク）
  target: number; // 目標値
  direction: "higher-is-better" | "lower-is-better";
}

/** 効果プール（二重計上防止フレーム） */
export type EffectPoolId =
  | "pool-01" // 調達コスト変動プール
  | "pool-02" // 供給停止・機会損失プール
  | "pool-03" // 稼働・生産性ロスプール
  | "pool-04" // 品質損失プール
  | "pool-05" // 物流・輸送コストプール
  | "pool-06" // 保管・在庫コストプール
  | "pool-07"; // 環境・資源循環コストプール

export interface EffectPool {
  id: EffectPoolId;
  name: string;
  overlapNote?: string; // 二重計上リスクに関する注記
}

/** プロセス1〜7それぞれのマスターレコード（process_metrics テーブルに相当） */
export interface ProcessMetric {
  id: string; // 'p1' ... 'p7'
  order: number; // 1〜7
  key: string; // 施策コード 例 'P1-01'
  processName: string; // 例：「調達・購買」
  stageLabel: string; // 例：「上流」「中流」「下流」「最終」
  initiative: string; // 施策名
  pool: EffectPoolId;
  financial: FinancialLayer;
  benchmarks: BenchmarkMetric[];
  evidenceNote: string; // Layer1 エビデンスの要約
  kpiNote: string; // Layer2 運用KPIの要約
  ownerFunctions: string[]; // 主管部門（製造現場／品質保証／SCM）
  status: "on-track" | "watch" | "alert"; // ROI/KPI進捗ステータス（UI色分け用）
}

/** ボトム層：4大トレンドカード（trend_metrics テーブルに相当） */
export interface TrendMetric {
  id: string;
  title: string;
  summary: string;
  relatedProcessIds: string[]; // 関連するプロセスID
  dataPoints: { label: string; value: number; unit: string }[];
  updatedAt: string; // ISO date
}

/** 全社ポートフォリオ集計（トップ層KPIバー用） */
export interface PortfolioSummary {
  totalCapexOku: number;
  totalOpexOkuPerYear: number;
  totalNetImpactOkuPerYear: number;
  weightedEbitRoiPercent: number;
  blendedPaybackYearsRange: [number, number];
}

// ----------------------------------------------------------------------------
// Supabase テーブル構成案（コメントのみ・実装時にマイグレーションへ移植する）
// ----------------------------------------------------------------------------
//
// table: process_metrics
//   id                text primary key            -- 'p1'..'p7'
//   "order"           smallint not null
//   key               text not null                -- 'P1-01' など施策コード
//   process_name      text not null
//   stage_label       text
//   initiative        text not null
//   pool              text references effect_pools(id)
//   capex_oku         numeric not null
//   opex_oku_per_year numeric not null
//   opex_nature       text check (opex_nature in ('system','hardware'))
//   net_impact_oku_per_year numeric not null
//   ebit_roi_percent  numeric not null
//   static_payback_years    numeric
//   effective_payback_years numeric
//   time_to_value_months    smallint
//   evidence_note     text
//   kpi_note          text
//   owner_functions   text[]
//   status            text check (status in ('on-track','watch','alert'))
//   updated_at        timestamptz default now()
//
// table: benchmark_data
//   id               uuid primary key default gen_random_uuid()
//   process_id       text references process_metrics(id)
//   label            text not null
//   unit             text
//   company_value    numeric
//   industry_avg     numeric
//   target           numeric
//   direction        text check (direction in ('higher-is-better','lower-is-better'))
//
// table: user_kpi
//   id               uuid primary key default gen_random_uuid()
//   org_id           uuid                          -- テナント分離用
//   process_id       text references process_metrics(id)
//   metric_label     text
//   actual_value     numeric
//   recorded_at      timestamptz default now()
//
// table: trend_metrics
//   id                 text primary key
//   title              text not null
//   summary            text
//   related_process_ids text[]
//   data_points        jsonb                        -- [{label,value,unit}]
//   updated_at         timestamptz default now()
//
// 詳細な CREATE TABLE 文は lib/schema.sql を参照。
