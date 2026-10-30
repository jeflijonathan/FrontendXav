/**
 * subjectHelper — Business Logic Utilities
 *
 * Pure functions for data resolution, FK resolution, formatting, and status mapping.
 * No React imports. No API calls.
 *
 * Layer: Business Logic
 */
import type { SubjectResponseModel } from "@api/subject/model";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";

export interface StatusChipConfig {
    label: string;
    color: "success" | "error";
}

export interface ResolvedSubjectCategory {
    id: string;
    name: string;
}

/**
 * Format date string to Indonesian locale format.
 * Returns "-" if null/empty/invalid.
 */
export function formatSubjectDate(dateStr?: string | null): string {
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

/**
 * Resolve status chip config (label + color).
 */
export function resolveSubjectStatusChip(
    status?: boolean | number | null
): StatusChipConfig {
    if (status === true || status === 1) {
        return { label: "Aktif", color: "success" };
    }
    return { label: "Non Aktif", color: "error" };
}

/**
 * Resolve primary key ID from SubjectResponseModel.
 */
export function resolveSubjectId(row: SubjectResponseModel): string {
    return row.id || row.id_subject || "-";
}

/**
 * Resolve Category Subject (FK: id_category_subject) from categories list or embedded object.
 */
export function resolveSubjectCategory(
    row: SubjectResponseModel,
    categories: CategorySubjectResponseModel[]
): ResolvedSubjectCategory | null {
    const categoryId = row.id_category_subject || row.category_subject_id;
    if (categoryId) {
        const found = categories.find(
            (c) => c.id === categoryId || c.id_category_subject === categoryId
        );
        if (found) {
            return {
                id: found.id || found.id_category_subject || categoryId,
                name: found.name,
            };
        }
    }

    if (row.category?.name) {
        return {
            id: row.category.id || row.category.id_category_subject || categoryId || "-",
            name: row.category.name,
        };
    }

    if (categoryId) {
        return {
            id: categoryId,
            name: categoryId,
        };
    }

    return null;
}

