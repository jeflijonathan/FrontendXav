/**
 * subjectHelper — Business Logic Utilities
 *
 * Pure functions for data resolution, FK resolution, formatting, and status/fase mapping.
 * English UI representation.
 * No React imports. No API calls.
 *
 * Layer: Business Logic
 */
import type { SubjectResponseModel } from "@api/subject/model";
import type { CategorySubjectResponseModel } from "@api/categorysubject/model";
import type { MajorResponseModel } from "@api/major/model";

export interface StatusChipConfig {
    label: string;
    color: "success" | "error";
}

export interface FaseChipConfig {
    label: string;
    color: "info" | "secondary" | "default";
}

export interface ResolvedSubjectCategory {
    id: string;
    name: string;
}

export interface ResolvedSubjectMajor {
    id: string;
    name: string;
}

/**
 * Business Rule for Fase Kurikulum:
 * - Grade 10: Phase E
 * - Grade 11-12: Phase F
 */
export function calculateFase(kelas?: string | null): string {
    if (!kelas) return "";
    const k = String(kelas).trim();
    if (k === "10") return "E";
    if (k === "11" || k === "12") return "F";
    return "";
}

/**
 * Resolve chip config for Phase (E / F).
 */
export function getFaseChipConfig(fase?: string | null, kelas?: string | null): FaseChipConfig {
    const activeFase = fase || calculateFase(kelas);
    if (activeFase === "E") {
        return { label: "Fase E", color: "info" };
    }
    if (activeFase === "F") {
        return { label: "Fase F", color: "secondary" };
    }
    return { label: "-", color: "default" };
}

/**
 * Format date string to standard format.
 * Returns "-" if null/empty/invalid.
 */
export function formatSubjectDate(dateStr?: string | null): string {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("en-GB", {
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
        return { label: "Active", color: "success" };
    }
    return { label: "Inactive", color: "error" };
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
    categories: CategorySubjectResponseModel[] = []
): ResolvedSubjectCategory | null {
    if (row.category?.name) {
        return {
            id: row.category.id || row.category.id_category_subject || row.id_category_subject || "-",
            name: row.category.name,
        };
    }

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
        return {
            id: categoryId,
            name: categoryId,
        };
    }

    return null;
}

/**
 * Resolve Major (FK: id_major) from majors list or embedded object.
 */
export function resolveSubjectMajor(
    row: SubjectResponseModel,
    majors: MajorResponseModel[] = []
): ResolvedSubjectMajor | null {
    if (row.major?.name) {
        return {
            id: row.major.id_major || row.major.id || row.id_major || "-",
            name: row.major.name,
        };
    }

    if (row.id_major) {
        const found = majors.find(
            (m) => m.id_major === row.id_major || m.id === row.id_major
        );
        if (found) {
            return {
                id: found.id_major || found.id || row.id_major,
                name: found.name,
            };
        }
    }

    return null;
}
