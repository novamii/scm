// ============================================================================
// lib/supabaseClient.ts
// Supabase接続クライアントと、ダッシュボード用のデータ取得関数群。
//
// 現状は data/processData.ts のモックJSONを返すが、
// 環境変数（NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY）を
// 設定すれば、下記コメントを外すだけで実データ取得に切り替えられる構造にしている。
// ============================================================================

import { createClient } from "@supabase/supabase-js";
import type { ProcessMetric, TrendMetric, PortfolioSummary } from "./types";
import { processMetrics, trendMetrics, portfolioSummary } from "@/data/processData";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// URL/Keyが未設定の場合はモックデータのみで動作する（開発・デモ用フォールバック）
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const USE_MOCK = supabase === null;

/** プロセス1〜7の一覧を取得（process_metrics + benchmark_data を結合） */
export async function fetchProcessMetrics(): Promise<ProcessMetric[]> {
  if (USE_MOCK) {
    return Promise.resolve(processMetrics);
  }

  // --- Supabase接続時の実装例 ------------------------------------------------
  // const { data, error } = await supabase!
  //   .from("process_metrics")
  //   .select(
  //     `*, benchmark_data ( id, label, unit, company_value, industry_avg, target, direction )`
  //   )
  //   .order("order", { ascending: true });
  //
  // if (error) throw error;
  // return data as unknown as ProcessMetric[];
  // ----------------------------------------------------------------------------

  return Promise.resolve(processMetrics);
}

/** ボトム層：4大トレンドカードを取得 */
export async function fetchTrendMetrics(): Promise<TrendMetric[]> {
  if (USE_MOCK) {
    return Promise.resolve(trendMetrics);
  }

  // const { data, error } = await supabase!.from("trend_metrics").select("*");
  // if (error) throw error;
  // return data as unknown as TrendMetric[];

  return Promise.resolve(trendMetrics);
}

/** トップ層：全社ポートフォリオ集計（サーバー側で事前集計 or ビューを想定） */
export async function fetchPortfolioSummary(): Promise<PortfolioSummary> {
  if (USE_MOCK) {
    return Promise.resolve(portfolioSummary);
  }

  // Supabase側で view: portfolio_summary_v を用意し、そこから1行取得する想定
  // const { data, error } = await supabase!.from("portfolio_summary_v").select("*").single();
  // if (error) throw error;
  // return data as unknown as PortfolioSummary;

  return Promise.resolve(portfolioSummary);
}
