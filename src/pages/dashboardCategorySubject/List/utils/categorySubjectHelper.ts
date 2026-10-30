/**
 * categorySubjectHelper — Business Logic Utilities
 *
 * Pure functions for data resolution, formatting, and status mapping.
 * No React imports. No API calls.
 *
 * Layer: Business Logic
 */
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";

export interface StatusChipConfig {
    label: string;
    color: "success" | "error";
}

export function formatCategoryDate(dateStr?: string | null): string {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function resolveCategoryStatusChip(
    status?: boolean | number | null
): StatusChipConfig {
    if (status === true || status === 1) {
        return { label: "Aktif", color: "success" };
    }
    return { label: "Non Aktif", color: "error" };
}

export function resolveCategoryId(row: CategorySubjectResponseModel): string {
    return row.id || row.id_category_subject || "-";
}

