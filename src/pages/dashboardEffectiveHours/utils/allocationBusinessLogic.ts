/**
 * Business Logic: Kalkulasi Alokasi Jam Pelajaran & Beban Mengajar (JTM)
 * Sesuai Regulasi Standar Kurikulum Merdeka & Pembagi Nasional Kemendikbudristek.
 * 
 * Lapisan ini murni berisi aturan bisnis (business logic) tanpa dependensi UI / framework.
 */

export const NATIONAL_REGULATION = {
  /** Standar pembagi minggu efektif nasional per tahun */
  NATIONAL_DIVIDER: 36,
  /** Batas minimal minggu efektif kalender sekolah */
  MIN_EFFECTIVE_WEEKS: 32,
  /** Batas maksimal minggu efektif kalender sekolah */
  MAX_EFFECTIVE_WEEKS: 48,
  /** Default minggu efektif kalender sekolah SMK Xaverius */
  DEFAULT_EFFECTIVE_WEEKS: 45,
  /** Kapasitas maksimum jam tatap muka per pekan (JP) */
  MAX_WEEKLY_CAPACITY: 46,
  /** Ambang batas minimal proporsi P5 (Kokurikuler) */
  P5_MIN_PERCENT: 20,
  /** Ambang batas maksimal proporsi P5 (Kokurikuler) */
  P5_MAX_PERCENT: 30,
};

export interface RawAllocationItem {
  id: string;
  id_subject: string;
  id_class?: string | null;
  id_major?: string | null;
  id_majors?: string[] | null;
  major_name?: string | null;
  major_names?: string[];
  subject_name: string;
  code_subject: string;
  rombel?: string;
  kelas?: string;
  fase?: "E" | "F" | string;
  category_name?: string;
  jp_intra_year: number; // JP Intrakurikuler per tahun
  jp_koku_year: number;  // JP Kokurikuler (P5) per tahun
  created_at?: string;
  updated_at?: string;
}

export type AllocationEvaluationStatus = "cadangan" | "defisit" | "sesuai";

export interface AllocationEvaluation {
  status: AllocationEvaluationStatus;
  diff: number; // Selisih / Alokasi Cadangan = JP Riil - Target Kurikulum
  label: string; // e.g. "+32 JP (Cadangan)", "-8 JP (Defisit)", "0 JP (Tepat Target)"
  description: string;
  badgeColor: "success" | "error" | "info" | "default";
}

export interface ComputedAllocationItem extends RawAllocationItem {
  /** Target Minimal Kurikulum = JP Intra Thn + JP Koku Thn (Asumsi patokan 36 minggu) */
  total_year: number;
  /** Intra per Minggu = JP Intra Thn ÷ 36 (pembulatan 1 desimal) */
  intra_per_week: number;
  /** Koku per Minggu = JP Koku Thn ÷ 36 (pembulatan 1 desimal) */
  koku_per_week: number;
  /** Total Mingguan = Intra/Mgg + Koku/Mgg */
  total_per_week: number;
  /** Jam Pelajaran Efektif (JP Riil) = ME × Jumlah JP per Minggu (Kalender Akademik) */
  real_projected: number;
  /** Selisih / Alokasi Cadangan = JP Riil Lapangan – Target Minimal Kurikulum */
  diff_cadangan: number;
  /** Analisis & Distribusi Alokasi Waktu (Alur Tujuan Pembelajaran / ATP & Prota) */
  evaluation: AllocationEvaluation;
  /** Rasio P5 pada mapel ini (%) */
  p5_ratio: number;
}

export interface AllocationSummaryStats {
  /** Total Minggu Efektif Sekolah (ME dari Kalender Akademik) */
  effectiveWeeks: number;
  /** Selisih dari regulasi standar (36 mgg) */
  diffFromNationalStandard: number;
  /** Total JP Intra per tahun seluruh mapel */
  totalIntraYear: number;
  /** Total JP Kokurikuler per tahun seluruh mapel */
  totalKokuYear: number;
  /** Total JP Tahunan Gabungan (Target Minimal Kurikulum) */
  totalOverallYear: number;
  /** Total JP Intra per minggu */
  totalIntraWeekly: number;
  /** Total JP Kokurikuler per minggu */
  totalKokuWeekly: number;
  /** Total Beban Mingguan (JP/Minggu) */
  totalWeekly: number;
  /** Sisa Kapasitas Mingguan yang masih tersedia */
  capacityAvailable: number;
  /** Total Akumulasi JP Kalender Riil */
  totalRealProjected: number;
  /** Akumulasi JP berdasarkan standar 36 minggu */
  standardYearlyJp: number;
  /** Selisih JP kalender riil vs standar 36 minggu (Total Cadangan / Defisit) */
  surplusJp: number;
  /** Total Selisih Alokasi Cadangan = Total JP Riil - Total Target Kurikulum */
  totalDiffCadangan: number;
  /** Evaluasi global sekolah */
  globalEvaluation: AllocationEvaluation;
  /** Persentase Rasio P5 (%) */
  p5RatioPercent: number;
  /** Status kepatuhan rasio P5 */
  isP5Compliant: boolean;
  /** Label status kepatuhan */
  complianceLabel: string;
  /** Tingkat kepatuhan: optimal | warning | error */
  complianceLevel: "success" | "warning" | "error";
}

/**
 * Pembulatan angka ke n desimal (default: 1 desimal)
 */
export const roundToDecimal = (val: number, decimals: number = 1): number => {
  if (isNaN(val) || !isFinite(val)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
};

/**
 * Formula 1: ALOKASI INTRA MINGGUAN
 * Intra/Mgg = JP Intra Thn ÷ 36 (Dihitung pembulatan 1 desimal)
 */
export const calculateIntraWeekly = (
  jpIntraYear: number,
  divider: number = NATIONAL_REGULATION.NATIONAL_DIVIDER
): number => {
  if (jpIntraYear <= 0 || divider <= 0) return 0;
  return roundToDecimal(jpIntraYear / divider, 1);
};

/**
 * Formula 2: ALOKASI P5 (KOKURIKULER)
 * Koku/Mgg = JP Koku Thn ÷ 36 (Sesuai proporsi 20-30%)
 */
export const calculateKokuWeekly = (
  jpKokuYear: number,
  divider: number = NATIONAL_REGULATION.NATIONAL_DIVIDER
): number => {
  if (jpKokuYear <= 0 || divider <= 0) return 0;
  return roundToDecimal(jpKokuYear / divider, 1);
};

/**
 * Formula 3: TOTAL BEBAN MINGGUAN
 * Total/Mgg = Intra/Mgg + Koku/Mgg
 */
export const calculateTotalWeekly = (
  intraWeekly: number,
  kokuWeekly: number
): number => {
  return roundToDecimal(intraWeekly + kokuWeekly, 1);
};

/**
 * Formula 4: PROYEKSI JAM PELAJARAN (JP) EFEKTIF RIIL
 * Jam Pelajaran Efektif (JP Riil) = ME × Jumlah JP per Minggu
 * ME: Hasil perhitungan Minggu Efektif dari Kalender Akademik.
 * Jumlah JP per Minggu: Kolom TOTAL / MGG (Beban jam mengajar riil mata pelajaran).
 */
export const calculateRealProjected = (
  totalWeekly: number,
  effectiveWeeks: number
): number => {
  return roundToDecimal(totalWeekly * effectiveWeeks, 0);
};

/**
 * Formula 5: ANALISIS ALOKASI WAKTU & DISTRIBUSI CADANGAN (ATP / Modul Ajar SMK)
 * Sesuai Regulasi Kemendikdasmen (Permendikbudristek No. 12/2024 & Panduan PPA SMK)
 * Selisih / Alokasi Cadangan = JP Riil Lapangan – Target Minimal Kurikulum (36 Mgg)
 * 
 * Interpretasi:
 * - Hasil (+) Positif: Terdapat kelebihan jam mengajar di lapangan. Dialokasikan resmi
 *   sebagai Jam Cadangan, Pengayaan, atau Penguatan Proyek pada Alur Tujuan Pembelajaran (ATP) & Modul Ajar.
 * - Hasil (-) Negatif: Terdapat kekurangan jam mengajar. Guru harus menyesuaikan pemetaan
 *   Tujuan Pembelajaran (TP) / Modul Ajar agar selaras dengan minggu efektif yang tersedia.
 * - Hasil 0 (Seimbang): Alokasi jam tatap muka riil tepat sesuai struktur kurikulum nasional.
 */
export const evaluateAllocationDifference = (
  realProjected: number,
  targetKurikulum: number
): AllocationEvaluation => {
  const diff = roundToDecimal(realProjected - targetKurikulum, 0);
  if (diff > 0) {
    return {
      status: "cadangan",
      diff,
      label: `+${diff} JP (Cadangan ATP)`,
      description: "Kelebihan jam mengajar: Dialokasikan sebagai Jam Cadangan & Pengayaan pada Alur Tujuan Pembelajaran (ATP) / Modul Ajar.",
      badgeColor: "success",
    };
  }
  if (diff < 0) {
    return {
      status: "defisit",
      diff,
      label: `${diff} JP (Defisit Jam)`,
      description: "Kekurangan jam mengajar: Guru perlu menyesuaikan pemetaan Tujuan Pembelajaran (TP) pada ATP agar tuntas.",
      badgeColor: "error",
    };
  }
  return {
    status: "sesuai",
    diff: 0,
    label: "0 JP (Tepat Target)",
    description: "Alokasi jam tatap muka riil tepat sesuai standar struktur kurikulum nasional.",
    badgeColor: "info",
  };
};

/**
 * Mengkalkulasi item alokasi lengkap beserta turunan rumusnya
 */
export const computeAllocationItem = (
  item: RawAllocationItem,
  effectiveWeeks: number
): ComputedAllocationItem => {
  const intraWeekly = calculateIntraWeekly(item.jp_intra_year);
  const kokuWeekly = calculateKokuWeekly(item.jp_koku_year);
  const totalWeekly = calculateTotalWeekly(intraWeekly, kokuWeekly);
  const realProjected = calculateRealProjected(totalWeekly, effectiveWeeks);

  const totalYear = item.jp_intra_year + item.jp_koku_year;
  const p5Ratio = totalYear > 0 ? roundToDecimal((item.jp_koku_year / totalYear) * 100, 1) : 0;
  const evaluation = evaluateAllocationDifference(realProjected, totalYear);

  return {
    ...item,
    total_year: totalYear,
    intra_per_week: intraWeekly,
    koku_per_week: kokuWeekly,
    total_per_week: totalWeekly,
    real_projected: realProjected,
    diff_cadangan: evaluation.diff,
    evaluation,
    p5_ratio: p5Ratio,
  };
};

/**
 * Menghitung rekapitulasi statistik total & status kepatuhan kurikulum
 */
export const calculateAllocationSummary = (
  items: ComputedAllocationItem[],
  effectiveWeeks: number
): AllocationSummaryStats => {
  const totalIntraYear = items.reduce((acc, curr) => acc + (curr.jp_intra_year || 0), 0);
  const totalKokuYear = items.reduce((acc, curr) => acc + (curr.jp_koku_year || 0), 0);
  const totalOverallYear = totalIntraYear + totalKokuYear;

  const totalIntraWeekly = roundToDecimal(
    items.reduce((acc, curr) => acc + (curr.intra_per_week || 0), 0),
    1
  );
  const totalKokuWeekly = roundToDecimal(
    items.reduce((acc, curr) => acc + (curr.koku_per_week || 0), 0),
    1
  );
  const totalWeekly = roundToDecimal(
    items.reduce((acc, curr) => acc + (curr.total_per_week || 0), 0),
    1
  );

  const totalRealProjected = roundToDecimal(
    items.reduce((acc, curr) => acc + (curr.real_projected || 0), 0),
    0
  );

  const standardYearlyJp = roundToDecimal(
    totalWeekly * NATIONAL_REGULATION.NATIONAL_DIVIDER,
    0
  );
  const surplusJp = totalRealProjected - totalOverallYear;
  const totalDiffCadangan = surplusJp;
  const globalEvaluation = evaluateAllocationDifference(totalRealProjected, totalOverallYear);

  // Rasio P5
  const p5RatioPercent = totalOverallYear > 0
    ? roundToDecimal((totalKokuYear / totalOverallYear) * 100, 1)
    : 0;

  const isP5Compliant =
    p5RatioPercent >= NATIONAL_REGULATION.P5_MIN_PERCENT &&
    p5RatioPercent <= NATIONAL_REGULATION.P5_MAX_PERCENT;

  let complianceLabel = "Optimal & Memenuhi Rasio";
  let complianceLevel: "success" | "warning" | "error" = "success";

  if (p5RatioPercent === 0 && totalKokuYear === 0 && items.length > 0) {
    complianceLabel = "Belum Ada Alokasi P5";
    complianceLevel = "warning";
  } else if (p5RatioPercent < NATIONAL_REGULATION.P5_MIN_PERCENT) {
    complianceLabel = `Rasio P5 Rendah (<${NATIONAL_REGULATION.P5_MIN_PERCENT}%)`;
    complianceLevel = "warning";
  } else if (p5RatioPercent > NATIONAL_REGULATION.P5_MAX_PERCENT) {
    complianceLabel = `Rasio P5 Tinggi (>${NATIONAL_REGULATION.P5_MAX_PERCENT}%)`;
    complianceLevel = "warning";
  }

  const capacityAvailable = Math.max(
    0,
    roundToDecimal(NATIONAL_REGULATION.MAX_WEEKLY_CAPACITY - totalWeekly, 1)
  );

  return {
    effectiveWeeks,
    diffFromNationalStandard: effectiveWeeks - NATIONAL_REGULATION.NATIONAL_DIVIDER,
    totalIntraYear,
    totalKokuYear,
    totalOverallYear,
    totalIntraWeekly,
    totalKokuWeekly,
    totalWeekly,
    capacityAvailable,
    totalRealProjected,
    standardYearlyJp,
    surplusJp,
    totalDiffCadangan,
    globalEvaluation,
    p5RatioPercent,
    isP5Compliant,
    complianceLabel,
    complianceLevel,
  };
};

