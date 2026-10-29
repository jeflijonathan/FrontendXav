/**
 * detailClassHelper — Business Logic Utilities for Detail Class
 *
 * Pure functions for data resolution, formatting, and display transformation
 * used in the class detail view.
 *
 * Layer: Business Logic (no React imports, no API calls, fully testable)
 */

import type { ClassResponseModel } from "@api/class/model";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MajorLike {
    id_major: string;
    name: string;
}

export interface EmployeeLike {
    id: string;
    first_name: string;
    last_name?: string | null;
    niy?: string | null;
}

export interface SchoolInfoLike {
    id_school_information: string;
    periode?: string | null;
    status?: boolean;
}

export interface GenderChipConfig {
    label: string;
    color: "info" | "secondary" | "default";
}

// ─── Resolvers ────────────────────────────────────────────────────────────────

export function resolveDetailMajor(
    detail: ClassResponseModel,
    majors: MajorLike[]
): MajorLike | null {
    return majors.find((m) => m.id_major === detail.id_major) ?? detail.major ?? null;
}

export function resolveDetailEmployee(
    detail: ClassResponseModel,
    employees: EmployeeLike[]
): EmployeeLike | null {
    return employees.find((e) => e.id === detail.id_class_guardian) ?? detail.class_guardian ?? null;
}

export function resolveDetailSchoolInfo(
    detail: ClassResponseModel,
    schoolInformations: SchoolInfoLike[]
): SchoolInfoLike | null {
    return (
        schoolInformations.find((s) => s.id_school_information === detail.id_school_information) ??
        detail.school_information ??
        null
    );
}

// ─── Name Formatters ──────────────────────────────────────────────────────────

export function formatEmployeeFullName(employee: EmployeeLike | null): string {
    if (!employee) return "Belum ditentukan";
    return `${employee.first_name} ${employee.last_name || ""}`.trim();
}

export function formatStudentDisplayName(
    student: { first_name?: string | null; last_name?: string | null }
): string {
    return `${student.first_name || ""} ${student.last_name || ""}`.trim() || "-";
}

// ─── Date Formatters ──────────────────────────────────────────────────────────

export function formatDetailDateTime(dateStr?: string | null): string {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID");
}

// ─── Gender Chip ──────────────────────────────────────────────────────────────

export function getStudentGenderChip(gender?: string | null): GenderChipConfig {
    if (gender === "L") return { label: "Laki-laki", color: "info" };
    if (gender === "P") return { label: "Perempuan", color: "secondary" };
    return { label: "-", color: "default" };
}

// ─── Photo URL ────────────────────────────────────────────────────────────────

export function getStudentDetailPhotoUrl(
    profileUrl?: string | null,
    backendBaseUrl?: string
): string | null {
    if (!profileUrl) return null;
    const base = backendBaseUrl || "";
    return `${base}/api/upload/${profileUrl}`;
}

